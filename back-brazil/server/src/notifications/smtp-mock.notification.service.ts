import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Lot } from '../shared/models/lot.model';
import { NotificationService } from './notification.service';

// Implémentation mock : simule l'envoi SMTP par un log structuré.
// Remplacer par une vraie impl Nodemailer en production.
@Injectable()
export class SmtpMockNotificationService extends NotificationService {
  private readonly logger = new Logger(SmtpMockNotificationService.name);
  private readonly recipientEmail: string;

  constructor(private readonly config: ConfigService) {
    super();
    this.recipientEmail =
      config.get<string>('ALERT_RECIPIENT_EMAIL') ??
      'ops-brazil@futurekawa.com';
  }

  async sendConditionAlert(
    lot: Lot,
    temperatureC: number,
    humidityPercent: number,
  ): Promise<void> {
    this.logger.warn(
      `[EMAIL → ${this.recipientEmail}] ALERTE CONDITIONS — Lot ${lot.reference} (${lot.warehouseName}) : ${temperatureC}°C / ${humidityPercent}% hors plage cible`,
    );
  }

  async sendExpiryAlert(lot: Lot, storageDays: number): Promise<void> {
    this.logger.warn(
      `[EMAIL → ${this.recipientEmail}] ALERTE PÉREMPTION — Lot ${lot.reference} stocké depuis ${storageDays} jours (> 365)`,
    );
  }
}
