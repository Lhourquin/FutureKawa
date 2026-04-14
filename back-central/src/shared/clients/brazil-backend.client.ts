import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AlertDto } from '../../alerts/dto/alert.dto';
import { CountryCode } from '../enums/country-code.enum';
import { LotDetailDto } from '../../lots/dto/lot-detail.dto';
import { MeasurementHistoryItemDto } from '../../lots/dto/measurement-history-item.dto';
import { LotSummaryDto } from '../../countries/dto/lot-summary.dto';

interface BrazilLotDetailResponse {
  id: string;
  reference: string;
  warehouseId: string;
  warehouseName: string;
  countryCode: 'BR';
  productName: string;
  producer: string;
  harvestDate: string;
  storedAt: string;
  storageDays: number;
  quantityKg: number;
  latestTemperatureC: number | null;
  latestHumidityPercent: number | null;
  latestMeasuredAt: string | null;
  conditionsInRange: boolean | null;
}

@Injectable()
export class BrazilBackendClient {
  private readonly baseUrl =
    process.env.BRAZIL_API_BASE_URL ?? 'http://localhost:3001/api';

  async getLots(): Promise<LotSummaryDto[]> {
    return this.fetchJson<LotSummaryDto[]>('/lots');
  }

  async getLotDetail(lotId: string): Promise<LotDetailDto> {
    const lot = await this.fetchJson<BrazilLotDetailResponse>(`/lots/${lotId}`);

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
    return this.fetchJson<MeasurementHistoryItemDto[]>(
      `/lots/${lotId}/measurements`,
    );
  }

  async getAlerts(): Promise<AlertDto[]> {
    return this.fetchJson<AlertDto[]>('/alerts');
  }

  private async fetchJson<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`);

    if (!response.ok) {
      throw new InternalServerErrorException(
        `Brazil backend request failed: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as T;
  }
}
