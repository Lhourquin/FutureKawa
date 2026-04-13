import { ApiProperty } from '@nestjs/swagger';

export class MeasurementHistoryItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ description: 'Horodatage ISO de la mesure.' })
  measuredAt!: string;

  @ApiProperty({ description: 'Temperature relevee en degres Celsius.' })
  temperatureC!: number;

  @ApiProperty({ description: "Humidite relevee en pourcentage." })
  humidityPercent!: number;
}
