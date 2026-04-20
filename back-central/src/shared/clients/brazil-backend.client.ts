import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { AlertDto } from '../../alerts/dto/alert.dto';
import { CountryCode } from '../enums/country-code.enum';
import { LotDetailDto } from '../../lots/dto/lot-detail.dto';
import { MeasurementHistoryItemDto } from '../../lots/dto/measurement-history-item.dto';
import { LotSummaryDto } from '../../countries/dto/lot-summary.dto';

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
}

const CACHE_TTL_MS = 30_000;
const REQUEST_TIMEOUT_MS = 5_000;
const MAX_RETRIES = 1;

// CountryClient (implémentation HTTP Brésil).
// Résilience : timeout 5 s, 1 retry, cache "dernière valeur connue" 30 s.
@Injectable()
export class BrazilBackendClient {
  private readonly logger = new Logger(BrazilBackendClient.name);
  private readonly baseUrl = process.env.BRAZIL_API_BASE_URL ?? 'http://localhost:3001/api';
  private readonly cache = new Map<string, CacheEntry<unknown>>();

  async getLots(): Promise<LotSummaryDto[]> {
    return this.fetchWithCache<LotSummaryDto[]>('/lots');
  }

  async getLotDetail(lotId: string): Promise<LotDetailDto> {
    const lot = await this.fetchWithCache<{
      id: string; reference: string; warehouseId: string; warehouseName: string;
      countryCode: 'BR'; productName: string; producer: string;
      harvestDate: string; storedAt: string; storageDays: number; quantityKg: number;
      latestTemperatureC: number | null; latestHumidityPercent: number | null;
      latestMeasuredAt: string | null; conditionsInRange: boolean | null;
    }>(`/lots/${lotId}`);

    return {
      id: lot.id,
      reference: lot.reference,
      countryCode: CountryCode.BR,
      countryName: 'Bresil',
      productName: lot.productName,
      producer: lot.producer,
      harvestDate: lot.harvestDate,
      storedAt: lot.storedAt,
      storageDays: lot.storageDays,
      quantityKg: lot.quantityKg,
      latestTemperatureC: lot.latestTemperatureC,
      latestHumidityPercent: lot.latestHumidityPercent,
      latestMeasuredAt: lot.latestMeasuredAt,
      conditionsInRange: lot.conditionsInRange,
    };
  }

  async getMeasurements(lotId: string): Promise<MeasurementHistoryItemDto[]> {
    return this.fetchWithCache<MeasurementHistoryItemDto[]>(`/lots/${lotId}/measurements`);
  }

  async getAlerts(): Promise<AlertDto[]> {
    return this.fetchWithCache<AlertDto[]>('/alerts');
  }

  async getWarehouses(): Promise<unknown[]> {
    return this.fetchWithCache<unknown[]>('/lots/warehouses');
  }

  async createLot(data: unknown): Promise<LotDetailDto> {
    this.invalidateLotsCache();
    return this.fetchJson<LotDetailDto>('/lots', { method: 'POST', body: data });
  }

  async updateLot(lotId: string, data: unknown): Promise<LotDetailDto> {
    this.invalidateLotsCache(lotId);
    return this.fetchJson<LotDetailDto>(`/lots/${lotId}`, { method: 'PATCH', body: data });
  }

  async deleteLot(lotId: string): Promise<void> {
    this.invalidateLotsCache(lotId);
    await this.fetchJson<void>(`/lots/${lotId}`, { method: 'DELETE' });
  }

  private invalidateLotsCache(lotId?: string): void {
    this.cache.delete('/lots');
    if (lotId) {
      this.cache.delete(`/lots/${lotId}`);
      this.cache.delete(`/lots/${lotId}/measurements`);
    }
  }

  private async fetchWithCache<T>(path: string): Promise<T> {
    const cached = this.cache.get(path) as CacheEntry<T> | undefined;
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      const data = await this.fetchWithRetry<T>(path);
      this.cache.set(path, { data, cachedAt: Date.now() });
      return data;
    } catch (err) {
      if (cached) {
        this.logger.warn(`Backend Brésil injoignable — valeur en cache retournée pour ${path}`);
        return cached.data;
      }
      throw err;
    }
  }

  private async fetchWithRetry<T>(path: string, attempt = 0): Promise<T> {
    try {
      return await this.fetchJson<T>(path);
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        this.logger.warn(`Retry ${attempt + 1}/${MAX_RETRIES} pour ${path}`);
        return this.fetchWithRetry<T>(path, attempt + 1);
      }
      throw err;
    }
  }

  private async fetchJson<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: options.method ?? 'GET',
        signal: controller.signal,
        headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      });
      if (!response.ok) {
        throw new InternalServerErrorException(
          `Brazil backend: ${response.status} ${response.statusText}`,
        );
      }
      if (response.status === 204) return undefined as T;
      return (await response.json()) as T;
    } finally {
      clearTimeout(timer);
    }
  }
}
