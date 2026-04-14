import { Inject, Injectable } from '@nestjs/common';
import { AlertDto } from './dto/alert.dto';
import { BrazilBackendClient } from '../shared/clients/brazil-backend.client';
import { AlertSeverity } from '../shared/enums/alert-severity.enum';
import { AlertType } from '../shared/enums/alert-type.enum';
import { CountryCode } from '../shared/enums/country-code.enum';
import {
  CLOCK,
  ClockRepository,
} from '../shared/repositories/clock.repository';
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
export class AlertsService {
  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,
    @Inject(LOT_REPOSITORY)
    private readonly lotRepository: LotRepository,
    @Inject(MEASUREMENT_REPOSITORY)
    private readonly measurementRepository: MeasurementRepository,
    @Inject(CLOCK) private readonly clockRepository: ClockRepository,
    private readonly brazilBackendClient: BrazilBackendClient,
    private readonly monitoringService: MonitoringService,
  ) {}

  async getAlerts(): Promise<AlertDto[]> {
    const countries = await this.countryRepository.findAll();
    const remoteBrazilAlerts = await this.brazilBackendClient.getAlerts();
    const lots = await this.lotRepository.findAll();
    const now = this.clockRepository.now();
    const countriesByCode = new Map(
      countries.map((country) => [country.code, country]),
    );
    const alerts: AlertDto[] = [];

    for (const lot of lots) {
      if (lot.countryCode === CountryCode.BR) {
        continue;
      }

      const country = countriesByCode.get(lot.countryCode);
      if (!country) {
        continue;
      }

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

    const brazilCountry = countriesByCode.get(CountryCode.BR);
    const normalizedBrazilAlerts = remoteBrazilAlerts.map((alert) => ({
      ...alert,
      countryCode: brazilCountry?.code ?? CountryCode.BR,
      countryName: brazilCountry?.name ?? 'Bresil',
    }));

    return [...normalizedBrazilAlerts, ...alerts].sort((left, right) =>
      right.detectedAt.localeCompare(left.detectedAt),
    );
  }
}
