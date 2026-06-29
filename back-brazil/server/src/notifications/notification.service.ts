import { Lot } from '../shared/models/lot.model';

export const NOTIFICATION_SERVICE = Symbol('NOTIFICATION_SERVICE');

export abstract class NotificationService {
  abstract sendConditionAlert(
    lot: Lot,
    temperatureC: number,
    humidityPercent: number,
  ): Promise<void>;
  abstract sendExpiryAlert(lot: Lot, storageDays: number): Promise<void>;
}
