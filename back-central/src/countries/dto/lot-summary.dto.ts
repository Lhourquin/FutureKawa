import { ApiProperty } from '@nestjs/swagger';
import { CountryCode } from '../../shared/enums/country-code.enum';

export class LotSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  reference!: string;

  @ApiProperty({ enum: CountryCode })
  countryCode!: CountryCode;

  @ApiProperty()
  productName!: string;

  @ApiProperty()
  producer!: string;

  @ApiProperty()
  quantityKg!: number;

  @ApiProperty({ description: "Date d'entree en stockage au format ISO." })
  storedAt!: string;

  @ApiProperty({ description: 'Nombre de jours de stockage.' })
  storageDays!: number;

  @ApiProperty({ nullable: true, description: 'Derniere temperature connue.' })
  latestTemperatureC!: number | null;

  @ApiProperty({ nullable: true, description: 'Derniere humidite connue.' })
  latestHumidityPercent!: number | null;

  @ApiProperty({
    nullable: true,
    description: 'Indique si la derniere mesure respecte la plage cible du pays.',
  })
  conditionsInRange!: boolean | null;
}
