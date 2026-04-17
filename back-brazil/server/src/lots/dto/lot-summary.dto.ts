import { ApiProperty } from '@nestjs/swagger';

export class LotSummaryDto {
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

  @ApiProperty()
  quantityKg!: number;

  @ApiProperty({ description: "Date d'entrée en stockage (ISO)." })
  storedAt!: string;

  @ApiProperty({ description: 'Nombre de jours de stockage.' })
  storageDays!: number;

  @ApiProperty({
    nullable: true,
    description: 'Dernière température connue (°C).',
  })
  latestTemperatureC!: number | null;

  @ApiProperty({ nullable: true, description: 'Dernière humidité connue (%).' })
  latestHumidityPercent!: number | null;

  @ApiProperty({
    nullable: true,
    description: 'Respect de la plage cible sur la dernière mesure.',
  })
  conditionsInRange!: boolean | null;
}
