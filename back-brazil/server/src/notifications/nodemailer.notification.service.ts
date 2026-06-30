import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Lot } from '../shared/models/lot.model';
import { NotificationService } from './notification.service';

@Injectable()
export class NodemailerNotificationService
  extends NotificationService
  implements OnModuleInit
{
  private readonly logger = new Logger(NodemailerNotificationService.name);
  private transporter!: nodemailer.Transporter;
  private readonly recipientEmail: string;
  private readonly senderEmail: string;

  constructor(private readonly config: ConfigService) {
    super();
    this.recipientEmail =
      config.get<string>('ALERT_RECIPIENT_EMAIL') ?? 'ops-brazil@futurekawa.com';
    this.senderEmail =
      config.get<string>('ALERT_SENDER_EMAIL') ?? 'alertes@futurekawa.com';
  }

  onModuleInit() {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST') ?? 'localhost',
      port: this.config.get<number>('SMTP_PORT') ?? 1025,
      secure: false,
      ignoreTLS: true,
    });
    this.logger.log(
      `SMTP configuré → ${this.config.get('SMTP_HOST') ?? 'localhost'}:${this.config.get('SMTP_PORT') ?? 1025}`,
    );
  }

  async sendConditionAlert(
    lot: Lot,
    temperatureC: number,
    humidityPercent: number,
  ): Promise<void> {
    const subject = `[ALERTE CONDITIONS] Lot ${lot.reference} — ${lot.warehouseName}`;
    const html = `
      <h2 style="color:#c62828;">⚠️ Alerte Conditions de Stockage</h2>
      <p>Les conditions du lot <strong>${lot.reference}</strong> sont hors plage acceptable.</p>
      <table border="1" cellpadding="8" style="border-collapse:collapse;">
        <tr><th>Entrepôt</th><td>${lot.warehouseName}</td></tr>
        <tr><th>Température mesurée</th><td style="color:#c62828;">${temperatureC} °C</td></tr>
        <tr><th>Humidité mesurée</th><td style="color:#c62828;">${humidityPercent} %</td></tr>
        <tr><th>Pays</th><td>${lot.countryCode}</td></tr>
      </table>
      <p>Veuillez vérifier les équipements de climatisation de l'entrepôt.</p>
      <hr/>
      <small>FutureKawa — Système d'alertes automatiques</small>
    `;

    await this.send(subject, html);
    this.logger.warn(
      `[EMAIL ENVOYÉ → ${this.recipientEmail}] ALERTE CONDITIONS — Lot ${lot.reference} : ${temperatureC}°C / ${humidityPercent}%`,
    );
  }

  async sendExpiryAlert(lot: Lot, storageDays: number): Promise<void> {
    const subject = `[ALERTE PÉREMPTION] Lot ${lot.reference} — ${storageDays} jours de stockage`;
    const html = `
      <h2 style="color:#e65100;">⏰ Alerte Péremption de Lot</h2>
      <p>Le lot <strong>${lot.reference}</strong> dépasse la durée maximale de stockage.</p>
      <table border="1" cellpadding="8" style="border-collapse:collapse;">
        <tr><th>Référence lot</th><td>${lot.reference}</td></tr>
        <tr><th>Entrepôt</th><td>${lot.warehouseName}</td></tr>
        <tr><th>Durée de stockage</th><td style="color:#e65100;"><strong>${storageDays} jours</strong> (seuil : 365 jours)</td></tr>
        <tr><th>Pays</th><td>${lot.countryCode}</td></tr>
      </table>
      <p>Ce lot doit être expédié ou traité en priorité (logique FIFO).</p>
      <hr/>
      <small>FutureKawa — Système d'alertes automatiques</small>
    `;

    await this.send(subject, html);
    this.logger.warn(
      `[EMAIL ENVOYÉ → ${this.recipientEmail}] ALERTE PÉREMPTION — Lot ${lot.reference} : ${storageDays} jours`,
    );
  }

  private async send(subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"FutureKawa Alertes" <${this.senderEmail}>`,
        to: this.recipientEmail,
        subject,
        html,
      });
    } catch (err) {
      this.logger.error(`Échec envoi e-mail : ${(err as Error).message}`);
    }
  }
}
