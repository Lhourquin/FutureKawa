import { Injectable } from '@nestjs/common';
import { Lot } from '../models/lot.model';
import { LotRepository } from './lot.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrismaLotRepository extends LotRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAll(): Promise<Lot[]> {
    const lots = await this.prisma.lot.findMany({
      orderBy: {
        reference: 'asc',
      },
    });

    return lots.map((lot) => ({
      id: lot.id,
      reference: lot.reference,
      warehouseId: lot.warehouseId,
      warehouseName: lot.warehouseName,
      countryCode: 'BR',
      productName: lot.productName,
      producer: lot.producer,
      harvestDate: lot.harvestDate.toISOString(),
      storedAt: lot.storedAt.toISOString(),
      quantityKg: lot.quantityKg,
    }));
  }

  async findById(id: string): Promise<Lot | null> {
    const lot = await this.prisma.lot.findUnique({
      where: {
        id,
      },
    });

    if (!lot) {
      return null;
    }

    return {
      id: lot.id,
      reference: lot.reference,
      warehouseId: lot.warehouseId,
      warehouseName: lot.warehouseName,
      countryCode: 'BR',
      productName: lot.productName,
      producer: lot.producer,
      harvestDate: lot.harvestDate.toISOString(),
      storedAt: lot.storedAt.toISOString(),
      quantityKg: lot.quantityKg,
    };
  }
}
