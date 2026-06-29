import { ApiProperty } from '@nestjs/swagger';
import { AlertSeverity } from '../../shared/enums/alert-severity.enum';
import { AlertType } from '../../shared/enums/alert-type.enum';

export class AlertDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: AlertType })
  type!: AlertType;

  @ApiProperty({ enum: AlertSeverity })
  severity!: AlertSeverity;

  @ApiProperty()
  message!: string;

  @ApiProperty({ description: 'Horodatage ISO de détection.' })
  detectedAt!: string;

  @ApiProperty()
  lotId!: string;

  @ApiProperty()
  lotReference!: string;
}
