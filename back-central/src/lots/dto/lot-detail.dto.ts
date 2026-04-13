import { ApiProperty } from '@nestjs/swagger';
import { CountryCode } from '../../shared/enums/country-code.enum';

export class LotDetailDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  reference!: string;

  @ApiProperty({ enum: CountryCode })
  countryCode!: CountryCode;

  @ApiProperty()
  countryName!: string;

  @ApiProperty()
  productName!: string;

  @ApiProperty()
  producer!: string;

  @ApiProperty({ description: 'Date de recolte du lot.' })
  harvestDate!: string;

  @ApiProperty({ description: "Date d'entree en stockage du lot." })
  storedAt!: string;

  @ApiProperty({ description: 'Anciennete du lot en stockage, en jours.' })
  storageDays!: number;

  @ApiProperty()
  quantityKg!: number;

  @ApiProperty({ nullable: true })
  latestTemperatureC!: number | null;

  @ApiProperty({ nullable: true })
  latestHumidityPercent!: number | null;

  @ApiProperty({ nullable: true })
  latestMeasuredAt!: string | null;

  @ApiProperty({
    nullable: true,
    description: 'Respect ou non de la plage cible sur la derniere mesure.',
  })
  conditionsInRange!: boolean | null;
}
