import { CountryCode } from '../enums/country-code.enum';

export interface CountryTargetProfile {
  readonly targetTemperatureC: number;
  readonly targetHumidityPercent: number;
  readonly temperatureToleranceC: number;
  readonly humidityTolerancePercent: number;
}

export interface Country {
  readonly code: CountryCode;
  readonly name: string;
  readonly targetProfile: CountryTargetProfile;
}
