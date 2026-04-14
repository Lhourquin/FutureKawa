import { Injectable } from '@nestjs/common';
import { Measurement } from '../models/measurement.model';
import { PrismaService } from '../../prisma/prisma.service';
import { MeasurementRepository } from './measurement.repository';

@Injectable()
export class PrismaMeasurementRepository extends MeasurementRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByLotId(lotId: string): Promise<Measurement[]> {
    const measurements = await this.prisma.measurement.findMany({
      where: {
        lotId,
      },
      orderBy: {
        measuredAt: 'asc',
      },
    });

    return measurements.map((measurement) => ({
      id: measurement.id,
      lotId: measurement.lotId,
      measuredAt: measurement.measuredAt.toISOString(),
      temperatureC: measurement.temperatureC,
      humidityPercent: measurement.humidityPercent,
    }));
  }

  async findLatestByLotId(lotId: string): Promise<Measurement | null> {
    const measurement = await this.prisma.measurement.findFirst({
      where: {
        lotId,
      },
      orderBy: {
        measuredAt: 'desc',
      },
    });

    if (!measurement) {
      return null;
    }

    return {
      id: measurement.id,
      lotId: measurement.lotId,
      measuredAt: measurement.measuredAt.toISOString(),
      temperatureC: measurement.temperatureC,
      humidityPercent: measurement.humidityPercent,
    };
  }
}
