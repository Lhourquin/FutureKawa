import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Measurement } from '../models/measurement.model';
import { MeasurementRepository } from './measurement.repository';

@Injectable()
export class PrismaMeasurementRepository extends MeasurementRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findBySensor(lotId: string, sensor: string): Promise<Measurement[]> {
    const rows = await this.prisma.measurement.findMany({
      where: { lotId, sensor },
      orderBy: { receivedAt: 'asc' },
    });
    return rows.map(this.toModel);
  }

  async findLatestBySensor(lotId: string, sensor: string): Promise<Measurement | null> {
    const row = await this.prisma.measurement.findFirst({
      where: { lotId, sensor },
      orderBy: { receivedAt: 'desc' },
    });
    return row ? this.toModel(row) : null;
  }

  async create(data: { lotId: string; sensor: string; value: number; unit: string }): Promise<Measurement> {
    const row = await this.prisma.measurement.create({ data });
    return this.toModel(row);
  }

  private toModel(row: { id: string; lotId: string; sensor: string; value: number; unit: string; receivedAt: Date }): Measurement {
    return {
      id: row.id,
      lotId: row.lotId,
      sensor: row.sensor,
      value: row.value,
      unit: row.unit,
      receivedAt: row.receivedAt.toISOString(),
    };
  }
}
