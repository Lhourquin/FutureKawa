import { Measurement } from '../models/measurement.model';

export const MEASUREMENT_REPOSITORY = Symbol('MEASUREMENT_REPOSITORY');

export abstract class MeasurementRepository {
  abstract findBySensor(lotId: string, sensor: string): Promise<Measurement[]>;
  abstract findLatestBySensor(lotId: string, sensor: string): Promise<Measurement | null>;
  abstract create(data: { lotId: string; sensor: string; value: number; unit: string }): Promise<Measurement>;
}
