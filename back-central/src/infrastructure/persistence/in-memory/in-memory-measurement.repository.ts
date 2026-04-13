import { Injectable } from '@nestjs/common';
import { Measurement } from '../../../domain/models/measurement.model';
import { MeasurementRepository } from '../../../domain/repositories/measurement.repository';
import { IN_MEMORY_DATASET } from './in-memory-dataset';

@Injectable()
export class InMemoryMeasurementRepository extends MeasurementRepository {
  async findByLotId(lotId: string): Promise<Measurement[]> {
    return IN_MEMORY_DATASET.measurements
      .filter((measurement) => measurement.lotId === lotId)
      .sort((left, right) => left.measuredAt.localeCompare(right.measuredAt));
  }

  async findLatestByLotId(lotId: string): Promise<Measurement | null> {
    const measurements = await this.findByLotId(lotId);
    return measurements.at(-1) ?? null;
  }
}
