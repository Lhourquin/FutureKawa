import { AlertSeverity } from '../enums/alert-severity.enum';
import { AlertType } from '../enums/alert-type.enum';

export interface Alert {
  readonly id: string;
  readonly type: AlertType;
  readonly severity: AlertSeverity;
  readonly message: string;
  readonly detectedAt: string;
  readonly lotId: string;
  readonly lotReference: string;
}
