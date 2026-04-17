import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CLOCK,
  ClockRepository,
} from '../shared/repositories/clock.repository';
import {
  LOT_REPOSITORY,
  LotRepository,
} from '../shared/repositories/lot.repository';
import {
  MEASUREMENT_REPOSITORY,
  MeasurementRepository,
} from '../shared/repositories/measurement.repository';
import { MonitoringService } from '../shared/services/monitoring.service';
import { CreateLotDto } from './dto/create-lot.dto';
import { LotDetailDto } from './dto/lot-detail.dto';
import { LotSummaryDto } from './dto/lot-summary.dto';
import { MeasurementHistoryItemDto } from './dto/measurement-history-item.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { WarehouseOverviewDto } from './dto/warehouse-overview.dto';

@Injectable()
export class LotsService {
  constructor(
    @Inject(LOT_REPOSITORY) private readonly lotRepository: LotRepository,
    @Inject(MEASUREMENT_REPOSITORY)
    private readonly measurementRepository: MeasurementRepository,
    @Inject(CLOCK) private readonly clockRepository: ClockRepository,
    private readonly monitoringService: MonitoringService,
  ) {}

  // Tri FIFO : lots ordonnés par date d'entrée en stockage (storedAt ASC)
  async getLots(): Promise<LotSummaryDto[]> {
    const lots = await this.lotRepository.findAll();
    const now = this.clockRepository.now();

    return Promise.all(
      lots.map(async (lot) => {
        const [latestTemp, latestHumidity] = await Promise.all([
          this.measurementRepository.findLatestBySensor(lot.id, 'temperature'),
          this.measurementRepository.findLatestBySensor(lot.id, 'humidity'),
        ]);

        const latestTemperatureC = latestTemp?.value ?? null;
        const latestHumidityPercent = latestHumidity?.value ?? null;

        return {
          id: lot.id,
          reference: lot.reference,
          warehouseId: lot.warehouseId,
          warehouseName: lot.warehouseName,
          countryCode: lot.countryCode as 'BR',
          productName: lot.productName,
          producer: lot.producer,
          quantityKg: lot.quantityKg,
          storedAt: lot.storedAt,
          storageDays: this.monitoringService.computeStorageDays(
            lot.storedAt,
            now,
          ),
          latestTemperatureC,
          latestHumidityPercent,
          conditionsInRange: this.monitoringService.isWithinBrazilRange(
            latestTemperatureC,
            latestHumidityPercent,
          ),
        };
      }),
    );
  }

  async getLotDetail(lotId: string): Promise<LotDetailDto> {
    const lot = await this.lotRepository.findById(lotId);
    if (!lot) throw new NotFoundException(`Lot ${lotId} not found`);

    const [latestTemp, latestHumidity] = await Promise.all([
      this.measurementRepository.findLatestBySensor(lot.id, 'temperature'),
      this.measurementRepository.findLatestBySensor(lot.id, 'humidity'),
    ]);

    const latestTemperatureC = latestTemp?.value ?? null;
    const latestHumidityPercent = latestHumidity?.value ?? null;
    const latestMeasuredAt =
      [latestTemp?.receivedAt, latestHumidity?.receivedAt]
        .filter(Boolean)
        .sort()
        .at(-1) ?? null;

    return {
      id: lot.id,
      reference: lot.reference,
      warehouseId: lot.warehouseId,
      warehouseName: lot.warehouseName,
      countryCode: lot.countryCode as 'BR',
      productName: lot.productName,
      producer: lot.producer,
      harvestDate: lot.harvestDate,
      storedAt: lot.storedAt,
      storageDays: this.monitoringService.computeStorageDays(
        lot.storedAt,
        this.clockRepository.now(),
      ),
      quantityKg: lot.quantityKg,
      latestTemperatureC,
      latestHumidityPercent,
      latestMeasuredAt,
      conditionsInRange: this.monitoringService.isWithinBrazilRange(
        latestTemperatureC,
        latestHumidityPercent,
      ),
    };
  }

  async getWarehouses(): Promise<WarehouseOverviewDto[]> {
    const lots = await this.getLots();
    const map = new Map<string, LotSummaryDto[]>();
    for (const lot of lots) {
      if (!map.has(lot.warehouseId)) map.set(lot.warehouseId, []);
      map.get(lot.warehouseId)!.push(lot);
    }
    return Array.from(map.entries()).map(([warehouseId, wLots]) => {
      const withTemp = wLots.filter((l) => l.latestTemperatureC !== null);
      const withHum  = wLots.filter((l) => l.latestHumidityPercent !== null);
      return {
        warehouseId,
        warehouseName: wLots[0]?.warehouseName ?? warehouseId,
        totalLots: wLots.length,
        totalQuantityKg: wLots.reduce((s, l) => s + l.quantityKg, 0),
        lotsInRange:   wLots.filter((l) => l.conditionsInRange === true).length,
        lotsOutOfRange: wLots.filter((l) => l.conditionsInRange === false).length,
        lotsOverdue:   wLots.filter((l) => l.storageDays > 365).length,
        averageTemperatureC:
          withTemp.length > 0
            ? Number((withTemp.reduce((s, l) => s + l.latestTemperatureC!, 0) / withTemp.length).toFixed(1))
            : null,
        averageHumidityPercent:
          withHum.length > 0
            ? Number((withHum.reduce((s, l) => s + l.latestHumidityPercent!, 0) / withHum.length).toFixed(1))
            : null,
      };
    });
  }

  async createLot(dto: CreateLotDto): Promise<LotDetailDto> {
    const lot = await this.lotRepository.create(dto);
    return this.getLotDetail(lot.id);
  }

  async updateLot(lotId: string, dto: UpdateLotDto): Promise<LotDetailDto> {
    const existing = await this.lotRepository.findById(lotId);
    if (!existing) throw new NotFoundException(`Lot ${lotId} not found`);
    await this.lotRepository.update(lotId, dto);
    return this.getLotDetail(lotId);
  }

  async deleteLot(lotId: string): Promise<void> {
    const existing = await this.lotRepository.findById(lotId);
    if (!existing) throw new NotFoundException(`Lot ${lotId} not found`);
    await this.lotRepository.delete(lotId);
  }

  async getMeasurements(lotId: string): Promise<MeasurementHistoryItemDto[]> {
    const lot = await this.lotRepository.findById(lotId);
    if (!lot) throw new NotFoundException(`Lot ${lotId} not found`);

    const [temps, humidities] = await Promise.all([
      this.measurementRepository.findBySensor(lotId, 'temperature'),
      this.measurementRepository.findBySensor(lotId, 'humidity'),
    ]);

    return [...temps, ...humidities]
      .sort((a, b) => a.receivedAt.localeCompare(b.receivedAt))
      .map((m) => ({
        id: m.id,
        sensor: m.sensor,
        value: m.value,
        unit: m.unit,
        measuredAt: m.receivedAt,
      }));
  }
}
