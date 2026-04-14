import { Injectable } from '@nestjs/common';
import { MOCK_MEASUREMENTS } from '../data/mock-data';
import { Measurement } from '../models/measurement.model';
import { MeasurementRepository } from './measurement.repository';

@Injectable()
export class InMemoryMeasurementRepository extends MeasurementRepository {
  async findByLotId(lotId: string): Promise<Measurement[]> {
    return MOCK_MEASUREMENTS.filter((measurement) => measurement.lotId === lotId)
      .slice()
      .sort((left, right) => left.measuredAt.localeCompare(right.measuredAt));
  }

  async findLatestByLotId(lotId: string): Promise<Measurement | null> {
    const measurements = await this.findByLotId(lotId);
    return measurements.at(-1) ?? null;
  }
}
