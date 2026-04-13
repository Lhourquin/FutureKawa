import { CountryCode } from '../../domain/enums/country-code.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CountryDto {
  @ApiProperty({ enum: CountryCode, description: 'Code ISO simplifie du pays.' })
  code!: CountryCode;

  @ApiProperty({ description: 'Nom lisible du pays.' })
  name!: string;

  @ApiProperty({ description: 'Temperature cible en degres Celsius.', example: 29 })
  targetTemperatureC!: number;

  @ApiProperty({ description: "Humidite cible en pourcentage.", example: 55 })
  targetHumidityPercent!: number;

  @ApiProperty({ description: 'Tolerance de temperature autorisee.', example: 3 })
  temperatureToleranceC!: number;

  @ApiProperty({ description: "Tolerance d'humidite autorisee.", example: 2 })
  humidityTolerancePercent!: number;
}
