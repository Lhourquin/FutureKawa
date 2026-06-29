import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AlertDto } from './dto/alert.dto';
import {
  NOTIFICATION_SERVICE,
  NotificationService,
} from '../notifications/notification.service';
import { AlertSeverity } from '../shared/enums/alert-severity.enum';
import { AlertType } from '../shared/enums/alert-type.enum';
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

export interface MeasurementIngestedEvent {
  lotId: string;
}

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    @Inject(LOT_REPOSITORY) private readonly lotRepository: LotRepository,
    @Inject(MEASUREMENT_REPOSITORY)
    private readonly measurementRepository: MeasurementRepository,
    @Inject(CLOCK) private readonly clockRepository: ClockRepository,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationService,
    private readonly monitoringService: MonitoringService,
  ) {}

  // Déclenché après chaque ingestion MQTT → vérifie conditions ET péremption
  @OnEvent('measurement.ingested')
  async handleMeasurementIngested(
    event: MeasurementIngestedEvent,
  ): Promise<void> {
    const lot = await this.lotRepository.findById(event.lotId);
    if (!lot) return;

    const [latestTemp, latestHumidity] = await Promise.all([
      this.measurementRepository.findLatestBySensor(lot.id, 'temperature'),
      this.measurementRepository.findLatestBySensor(lot.id, 'humidity'),
    ]);

    const tempC = latestTemp?.value ?? null;
    const humPct = latestHumidity?.value ?? null;
    const inRange = this.monitoringService.isWithinBrazilRange(tempC, humPct);

    if (inRange === false) {
      this.logger.warn(
        `Alerte conditions — lot ${lot.reference} : ${tempC}°C / ${humPct}%`,
      );
      await this.notificationService.sendConditionAlert(lot, tempC!, humPct!);
    }

    const storageDays = this.monitoringService.computeStorageDays(
      lot.storedAt,
      this.clockRepository.now(),
    );
    if (storageDays > 365) {
      this.logger.warn(
        `Alerte péremption — lot ${lot.reference} : ${storageDays} j`,
      );
      await this.notificationService.sendExpiryAlert(lot, storageDays);
    }
  }

  // Endpoint GET /alerts : calcul à la demande pour la consultation REST
  async getAlerts(): Promise<AlertDto[]> {
    const lots = await this.lotRepository.findAll();
    const now = this.clockRepository.now();
    const alerts: AlertDto[] = [];

    for (const lot of lots) {
      const [latestTemp, latestHumidity] = await Promise.all([
        this.measurementRepository.findLatestBySensor(lot.id, 'temperature'),
        this.measurementRepository.findLatestBySensor(lot.id, 'humidity'),
      ]);

      const tempC = latestTemp?.value ?? null;
      const humPct = latestHumidity?.value ?? null;
      const inRange = this.monitoringService.isWithinBrazilRange(tempC, humPct);

      if (inRange === false) {
        const detectedAt =
          [latestTemp?.receivedAt, latestHumidity?.receivedAt]
            .filter(Boolean)
            .sort()
            .at(-1) ?? now.toISOString();

        alerts.push({
          id: `conditions-${lot.id}`,
          type: AlertType.CONDITIONS_OUT_OF_RANGE,
          severity: AlertSeverity.CRITICAL,
          message: `Lot ${lot.reference} hors plage cible : ${tempC}°C / ${humPct}%`,
          detectedAt,
          lotId: lot.id,
          lotReference: lot.reference,
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
          message: `Lot ${lot.reference} stocké depuis ${storageDays} jours`,
          detectedAt: now.toISOString(),
          lotId: lot.id,
          lotReference: lot.reference,
        });
      }
    }

    return alerts.sort((a, b) => b.detectedAt.localeCompare(a.detectedAt));
  }
}
