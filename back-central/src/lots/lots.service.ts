import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LotDetailDto } from './dto/lot-detail.dto';
import { MeasurementHistoryItemDto } from './dto/measurement-history-item.dto';
import { CLOCK, ClockRepository } from '../shared/repositories/clock.repository';
import {
  COUNTRY_REPOSITORY,
  CountryRepository,
} from '../shared/repositories/country.repository';
import {
  LOT_REPOSITORY,
  LotRepository,
} from '../shared/repositories/lot.repository';
import {
  MEASUREMENT_REPOSITORY,
  MeasurementRepository,
} from '../shared/repositories/measurement.repository';
import { MonitoringService } from '../shared/services/monitoring.service';

@Injectable()
export class LotsService {
  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
    @Inject(LOT_REPOSITORY)
    private readonly lotRepository: LotRepository,
    @Inject(MEASUREMENT_REPOSITORY)
    private readonly measurementRepository: MeasurementRepository,
    @Inject(CLOCK) private readonly clockRepository: ClockRepository,
    private readonly monitoringService: MonitoringService,
  ) {}

  async getLotDetail(lotId: string): Promise<LotDetailDto> {
    const lot = await this.lotRepository.findById(lotId);
    if (!lot) {
      throw new NotFoundException(`Lot ${lotId} not found`);
    }

    const country = await this.countryRepository.findByCode(lot.countryCode);
    if (!country) {
      throw new NotFoundException(`Country ${lot.countryCode} not found`);
    }

    const latestMeasurement =
      await this.measurementRepository.findLatestByLotId(lot.id);

    return {
      id: lot.id,
      reference: lot.reference,
      countryCode: lot.countryCode,
      countryName: country.name,
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
        ? this.monitoringService.isWithinRange(latestMeasurement, country)
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
