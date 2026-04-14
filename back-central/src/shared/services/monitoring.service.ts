import { Injectable } from '@nestjs/common';
import { Country } from '../models/country.model';
import { Measurement } from '../models/measurement.model';

@Injectable()
export class MonitoringService {
  computeStorageDays(storedAt: string, now: Date): number {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const diffMs = now.getTime() - new Date(storedAt).getTime();
    return Math.max(0, Math.floor(diffMs / millisecondsPerDay));
  }

  isWithinRange(measurement: Measurement, country: Country): boolean {
    const profile = country.targetProfile;
    const minTemperature =
      profile.targetTemperatureC - profile.temperatureToleranceC;
    const maxTemperature =
      profile.targetTemperatureC + profile.temperatureToleranceC;
    const minHumidity =
      profile.targetHumidityPercent - profile.humidityTolerancePercent;
    const maxHumidity =
      profile.targetHumidityPercent + profile.humidityTolerancePercent;

    return (
      measurement.temperatureC >= minTemperature &&
      measurement.temperatureC <= maxTemperature &&
      measurement.humidityPercent >= minHumidity &&
      measurement.humidityPercent <= maxHumidity
    );
  }
}
