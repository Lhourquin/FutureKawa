import { Measurement } from '../models/measurement.model';

export const MEASUREMENT_REPOSITORY = Symbol('MEASUREMENT_REPOSITORY');

export abstract class MeasurementRepository {
  abstract findByLotId(lotId: string): Promise<Measurement[]>;
  abstract findLatestByLotId(lotId: string): Promise<Measurement | null>;
}
