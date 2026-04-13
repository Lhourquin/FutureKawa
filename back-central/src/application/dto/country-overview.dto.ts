import { CountryCode } from '../../domain/enums/country-code.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CountryOverviewDto {
  @ApiProperty({ enum: CountryCode, description: 'Code du pays consolide.' })
  countryCode!: CountryCode;

  @ApiProperty({ description: 'Nom du pays consolide.' })
  countryName!: string;

  @ApiProperty({ description: 'Nombre total de lots suivis pour ce pays.' })
  totalLots!: number;

  @ApiProperty({ description: 'Nombre de lots dont la derniere mesure est conforme.' })
  lotsInRange!: number;

  @ApiProperty({ description: 'Nombre de lots dont la derniere mesure est hors plage.' })
  lotsOutOfRange!: number;

  @ApiProperty({ description: 'Nombre de lots stockes depuis plus de 365 jours.' })
  lotsStoredOver365Days!: number;

  @ApiProperty({
    description: 'Moyenne des dernieres temperatures relevees pour les lots du pays.',
    nullable: true,
  })
  averageLatestTemperatureC!: number | null;

  @ApiProperty({
    description: 'Moyenne des dernieres humidites relevees pour les lots du pays.',
    nullable: true,
  })
  averageLatestHumidityPercent!: number | null;
}
