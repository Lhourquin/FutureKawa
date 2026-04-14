import { Injectable } from '@nestjs/common';
import { BRAZIL_TARGETS } from '../data/mock-data';
import { Measurement } from '../models/measurement.model';

@Injectable()
export class MonitoringService {
  computeStorageDays(storedAt: string, now: Date): number {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const diffMs = now.getTime() - new Date(storedAt).getTime();
    return Math.max(0, Math.floor(diffMs / millisecondsPerDay));
  }

  isWithinBrazilRange(measurement: Measurement): boolean {
    const minTemperature =
      BRAZIL_TARGETS.targetTemperatureC - BRAZIL_TARGETS.temperatureToleranceC;
    const maxTemperature =
      BRAZIL_TARGETS.targetTemperatureC + BRAZIL_TARGETS.temperatureToleranceC;
    const minHumidity =
      BRAZIL_TARGETS.targetHumidityPercent - BRAZIL_TARGETS.humidityTolerancePercent;
    const maxHumidity =
      BRAZIL_TARGETS.targetHumidityPercent + BRAZIL_TARGETS.humidityTolerancePercent;

    return (
      measurement.temperatureC >= minTemperature &&
      measurement.temperatureC <= maxTemperature &&
      measurement.humidityPercent >= minHumidity &&
      measurement.humidityPercent <= maxHumidity
    );
  }
}
