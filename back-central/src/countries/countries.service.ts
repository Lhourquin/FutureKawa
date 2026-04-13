import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CountryDto } from './dto/country.dto';
import { CountryOverviewDto } from './dto/country-overview.dto';
import { LotSummaryDto } from './dto/lot-summary.dto';
import { CountryCode } from '../shared/enums/country-code.enum';
import { Country } from '../shared/models/country.model';
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
export class CountriesService {
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

  async getCountries(): Promise<CountryDto[]> {
    const countries = await this.countryRepository.findAll();
    return countries.map((country) => ({
      code: country.code,
      name: country.name,
      targetTemperatureC: country.targetProfile.targetTemperatureC,
      targetHumidityPercent: country.targetProfile.targetHumidityPercent,
      temperatureToleranceC: country.targetProfile.temperatureToleranceC,
      humidityTolerancePercent: country.targetProfile.humidityTolerancePercent,
    }));
  }

  async getCountryOverview(countryCode: CountryCode): Promise<CountryOverviewDto> {
    const country = await this.getCountryOrFail(countryCode);
    const lots = await this.getLotsByCountry(countryCode);
    const latestValues = lots.filter(
      (lot) => lot.latestTemperatureC !== null && lot.latestHumidityPercent !== null,
    );

    return {
      countryCode: country.code,
      countryName: country.name,
      totalLots: lots.length,
      lotsInRange: lots.filter((lot) => lot.conditionsInRange === true).length,
      lotsOutOfRange: lots.filter((lot) => lot.conditionsInRange === false).length,
      lotsStoredOver365Days: lots.filter((lot) => lot.storageDays > 365).length,
      averageLatestTemperatureC:
        latestValues.length > 0
          ? Number(
              (
                latestValues.reduce(
                  (sum, lot) => sum + (lot.latestTemperatureC ?? 0),
                  0,
                ) / latestValues.length
              ).toFixed(1),
            )
          : null,
      averageLatestHumidityPercent:
        latestValues.length > 0
          ? Number(
              (
                latestValues.reduce(
                  (sum, lot) => sum + (lot.latestHumidityPercent ?? 0),
                  0,
                ) / latestValues.length
              ).toFixed(1),
            )
          : null,
    };
  }

  async getLotsByCountry(countryCode: CountryCode): Promise<LotSummaryDto[]> {
    const country = await this.getCountryOrFail(countryCode);
    const lots = await this.lotRepository.findByCountryCode(countryCode);
    const now = this.clockRepository.now();

    const summaries = await Promise.all(
      lots.map(async (lot) => {
        const latestMeasurement =
          await this.measurementRepository.findLatestByLotId(lot.id);

        return {
          id: lot.id,
          reference: lot.reference,
          countryCode: lot.countryCode,
          productName: lot.productName,
          producer: lot.producer,
          quantityKg: lot.quantityKg,
          storedAt: lot.storedAt,
          storageDays: this.monitoringService.computeStorageDays(lot.storedAt, now),
          latestTemperatureC: latestMeasurement?.temperatureC ?? null,
          latestHumidityPercent: latestMeasurement?.humidityPercent ?? null,
          conditionsInRange: latestMeasurement
            ? this.monitoringService.isWithinRange(latestMeasurement, country)
            : null,
        };
      }),
    );

    return summaries.sort((left, right) => left.reference.localeCompare(right.reference));
  }

  private async getCountryOrFail(countryCode: CountryCode): Promise<Country> {
    const country = await this.countryRepository.findByCode(countryCode);
    if (!country) {
      throw new NotFoundException(`Country ${countryCode} not found`);
    }

    return country;
  }
}
