import { CountryCode } from '../enums/country-code.enum';
import { Country } from '../models/country.model';

export const COUNTRIES_CATALOG: Country[] = [
  {
    code: CountryCode.BR,
    name: 'Bresil',
    targetProfile: {
      targetTemperatureC: 29,
      targetHumidityPercent: 55,
      temperatureToleranceC: 3,
      humidityTolerancePercent: 2,
    },
  },
  {
    code: CountryCode.EC,
    name: 'Equateur',
    targetProfile: {
      targetTemperatureC: 31,
      targetHumidityPercent: 60,
      temperatureToleranceC: 3,
      humidityTolerancePercent: 2,
    },
  },
  {
    code: CountryCode.CO,
    name: 'Colombie',
    targetProfile: {
      targetTemperatureC: 26,
      targetHumidityPercent: 80,
      temperatureToleranceC: 3,
      humidityTolerancePercent: 2,
    },
  },
];
