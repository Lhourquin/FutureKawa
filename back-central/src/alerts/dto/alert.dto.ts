import { ApiProperty } from '@nestjs/swagger';
import { AlertSeverity } from '../../shared/enums/alert-severity.enum';
import { AlertType } from '../../shared/enums/alert-type.enum';
import { CountryCode } from '../../shared/enums/country-code.enum';

export class AlertDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: AlertType })
  type!: AlertType;

  @ApiProperty({ enum: AlertSeverity })
  severity!: AlertSeverity;

  @ApiProperty({ description: "Message fonctionnel de l'alerte." })
  message!: string;

  @ApiProperty({ description: 'Date ISO de detection de l alerte.' })
  detectedAt!: string;

  @ApiProperty()
  lotId!: string;

  @ApiProperty()
  lotReference!: string;

  @ApiProperty({ enum: CountryCode })
  countryCode!: CountryCode;

  @ApiProperty()
  countryName!: string;
}
