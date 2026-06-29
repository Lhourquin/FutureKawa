import { Injectable } from '@nestjs/common';
import { BRAZIL_STORAGE_TARGETS } from '../config/brazil-storage.config';

@Injectable()
export class MonitoringService {
  computeStorageDays(storedAt: string, now: Date): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.max(0, Math.floor((now.getTime() - new Date(storedAt).getTime()) / msPerDay));
  }

  isTemperatureInRange(temperatureC: number): boolean {
    const { targetTemperatureC, temperatureToleranceC } = BRAZIL_STORAGE_TARGETS;
    return (
      temperatureC >= targetTemperatureC - temperatureToleranceC &&
      temperatureC <= targetTemperatureC + temperatureToleranceC
    );
  }

  isHumidityInRange(humidityPercent: number): boolean {
    const { targetHumidityPercent, humidityTolerancePercent } = BRAZIL_STORAGE_TARGETS;
    return (
      humidityPercent >= targetHumidityPercent - humidityTolerancePercent &&
      humidityPercent <= targetHumidityPercent + humidityTolerancePercent
    );
  }

  // Renvoie null si l'une des deux valeurs est inconnue (capteur absent)
  isWithinBrazilRange(temperatureC: number | null, humidityPercent: number | null): boolean | null {
    if (temperatureC === null || humidityPercent === null) return null;
    return this.isTemperatureInRange(temperatureC) && this.isHumidityInRange(humidityPercent);
  }
}
