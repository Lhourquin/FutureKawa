import { ApiProperty } from '@nestjs/swagger';

export class LotDetailDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  reference!: string;

  @ApiProperty()
  warehouseId!: string;

  @ApiProperty()
  warehouseName!: string;

  @ApiProperty({ example: 'BR' })
  countryCode!: 'BR';

  @ApiProperty()
  productName!: string;

  @ApiProperty()
  producer!: string;

  @ApiProperty({ description: 'Date de récolte (ISO).' })
  harvestDate!: string;

  @ApiProperty({ description: "Date d'entrée en stockage (ISO)." })
  storedAt!: string;

  @ApiProperty({ description: 'Ancienneté en stockage (jours).' })
  storageDays!: number;

  @ApiProperty()
  quantityKg!: number;

  @ApiProperty({ nullable: true })
  latestTemperatureC!: number | null;

  @ApiProperty({ nullable: true })
  latestHumidityPercent!: number | null;

  @ApiProperty({
    nullable: true,
    description: 'Horodatage de la mesure la plus récente.',
  })
  latestMeasuredAt!: string | null;

  @ApiProperty({ nullable: true })
  conditionsInRange!: boolean | null;
}
