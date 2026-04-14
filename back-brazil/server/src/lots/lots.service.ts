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
import { LotDetailDto } from './dto/lot-detail.dto';
import { LotSummaryDto } from './dto/lot-summary.dto';
import { MeasurementHistoryItemDto } from './dto/measurement-history-item.dto';

@Injectable()
export class LotsService {
  constructor(
    @Inject(LOT_REPOSITORY)
    private readonly lotRepository: LotRepository,
    @Inject(MEASUREMENT_REPOSITORY)
    private readonly measurementRepository: MeasurementRepository,
    @Inject(CLOCK) private readonly clockRepository: ClockRepository,
    private readonly monitoringService: MonitoringService,
  ) {}

  async getLots(): Promise<LotSummaryDto[]> {
    const lots = await this.lotRepository.findAll();
    const now = this.clockRepository.now();

    const summaries = await Promise.all(
      lots.map(async (lot) => {
        const latestMeasurement =
          await this.measurementRepository.findLatestByLotId(lot.id);

        return {
          id: lot.id,
          reference: lot.reference,
          warehouseId: lot.warehouseId,
          warehouseName: lot.warehouseName,
          countryCode: lot.countryCode,
          productName: lot.productName,
          producer: lot.producer,
          quantityKg: lot.quantityKg,
          storedAt: lot.storedAt,
          storageDays: this.monitoringService.computeStorageDays(
            lot.storedAt,
            now,
          ),
          latestTemperatureC: latestMeasurement?.temperatureC ?? null,
          latestHumidityPercent: latestMeasurement?.humidityPercent ?? null,
          conditionsInRange: latestMeasurement
            ? this.monitoringService.isWithinBrazilRange(latestMeasurement)
            : null,
        };
      }),
    );

    return summaries.sort((left, right) =>
      left.reference.localeCompare(right.reference),
    );
  }

  async getLotDetail(lotId: string): Promise<LotDetailDto> {
    const lot = await this.lotRepository.findById(lotId);
    if (!lot) {
      throw new NotFoundException(`Lot ${lotId} not found`);
    }

    const latestMeasurement =
      await this.measurementRepository.findLatestByLotId(lot.id);

    return {
      id: lot.id,
      reference: lot.reference,
      warehouseId: lot.warehouseId,
      warehouseName: lot.warehouseName,
      countryCode: lot.countryCode,
      productName: lot.productName,
      producer: lot.producer,
      harvestDate: lot.harvestDate,
      storedAt: lot.storedAt,
      storageDays: this.monitoringService.computeStorageDays(
        lot.storedAt,
        this.clockRepository.now(),
      ),
      quantityKg: lot.quantityKg,
      latestTemperatureC: latestMeasurement?.temperatureC ?? null,
      latestHumidityPercent: latestMeasurement?.humidityPercent ?? null,
      latestMeasuredAt: latestMeasurement?.measuredAt ?? null,
      conditionsInRange: latestMeasurement
        ? this.monitoringService.isWithinBrazilRange(latestMeasurement)
        : null,
    };
  }

  async getMeasurements(lotId: string): Promise<MeasurementHistoryItemDto[]> {
    const lot = await this.lotRepository.findById(lotId);
    if (!lot) {
      throw new NotFoundException(`Lot ${lotId} not found`);
    }

    const measurements = await this.measurementRepository.findByLotId(lotId);

    return measurements.map((measurement) => ({
      id: measurement.id,
      measuredAt: measurement.measuredAt,
      temperatureC: measurement.temperatureC,
      humidityPercent: measurement.humidityPercent,
    }));
  }
}
