import { Inject, Injectable } from '@nestjs/common';
import { AlertDto } from '../dto/alert.dto';
import { AlertSeverity } from '../../domain/enums/alert-severity.enum';
import { AlertType } from '../../domain/enums/alert-type.enum';
import {
  COUNTRY_REPOSITORY,
  CountryRepository,
} from '../../domain/repositories/country.repository';
import {
  LOT_REPOSITORY,
  LotRepository,
} from '../../domain/repositories/lot.repository';
import {
  MEASUREMENT_REPOSITORY,
  MeasurementRepository,
} from '../../domain/repositories/measurement.repository';
import { CLOCK, Clock } from '../../domain/repositories/clock.repository';
import { MonitoringService } from './monitoring.service';

@Injectable()
export class AlertsService {
  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
    @Inject(LOT_REPOSITORY)
    private readonly lotRepository: LotRepository,
    @Inject(MEASUREMENT_REPOSITORY)
    private readonly measurementRepository: MeasurementRepository,
    @Inject(CLOCK) private readonly clock: Clock,
    private readonly monitoringService: MonitoringService,
  ) {}

  async getAlerts(): Promise<AlertDto[]> {
    const countries = await this.countryRepository.findAll();
    const now = this.clock.now();
    const alerts: AlertDto[] = [];

    for (const country of countries) {
      const lots = await this.lotRepository.findByCountryCode(country.code);

      for (const lot of lots) {
        const latestMeasurement =
          await this.measurementRepository.findLatestByLotId(lot.id);

        if (
          latestMeasurement &&
          !this.monitoringService.isWithinRange(latestMeasurement, country)
        ) {
          alerts.push({
            id: `conditions-${lot.id}`,
            type: AlertType.CONDITIONS_OUT_OF_RANGE,
            severity: AlertSeverity.CRITICAL,
            message: `Lot ${lot.reference} hors plage cible: ${latestMeasurement.temperatureC}°C / ${latestMeasurement.humidityPercent}%`,
            detectedAt: latestMeasurement.measuredAt,
            lotId: lot.id,
            lotReference: lot.reference,
            countryCode: country.code,
            countryName: country.name,
          });
        }

        const storageDays = this.monitoringService.computeStorageDays(
          lot.storedAt,
          now,
        );

        if (storageDays > 365) {
          alerts.push({
            id: `storage-${lot.id}`,
            type: AlertType.STORAGE_DURATION_EXCEEDED,
            severity: AlertSeverity.WARNING,
            message: `Lot ${lot.reference} stocke depuis ${storageDays} jours`,
            detectedAt: now.toISOString(),
            lotId: lot.id,
            lotReference: lot.reference,
            countryCode: country.code,
            countryName: country.name,
          });
        }
      }
    }

    return alerts.sort((left, right) => right.detectedAt.localeCompare(left.detectedAt));
  }
}
