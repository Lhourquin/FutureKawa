import { AlertSeverity } from '../../shared/enums/alert-severity.enum';
import { AlertType } from '../../shared/enums/alert-type.enum';

export class AlertDto {
  id!: string;
  type!: AlertType;
  severity!: AlertSeverity;
  message!: string;
  detectedAt!: string;
  lotId!: string;
  lotReference!: string;
}
