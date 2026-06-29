import { ApiProperty } from '@nestjs/swagger';

export class MeasurementHistoryItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({
    description: "Type de capteur : 'temperature' ou 'humidity'.",
  })
  sensor!: string;

  @ApiProperty({ description: 'Valeur relevée.' })
  value!: number;

  @ApiProperty({ description: "Unité : 'C' (Celsius) ou '%' (humidité)." })
  unit!: string;

  @ApiProperty({ description: 'Horodatage ISO de réception sur le serveur.' })
  measuredAt!: string;
}
