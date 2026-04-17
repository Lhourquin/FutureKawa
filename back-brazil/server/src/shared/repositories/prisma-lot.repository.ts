import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Lot } from '../models/lot.model';
import { CreateLotData, LotRepository, UpdateLotData } from './lot.repository';

@Injectable()
export class PrismaLotRepository extends LotRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAll(): Promise<Lot[]> {
    const lots = await this.prisma.lot.findMany({ orderBy: { storedAt: 'asc' } });
    return lots.map(this.toModel);
  }

  async findById(id: string): Promise<Lot | null> {
    const lot = await this.prisma.lot.findUnique({ where: { id } });
    return lot ? this.toModel(lot) : null;
  }

  async findByWarehouseId(warehouseId: string): Promise<Lot[]> {
    const lots = await this.prisma.lot.findMany({
      where: { warehouseId },
      orderBy: { storedAt: 'asc' },
    });
    return lots.map(this.toModel);
  }

  async create(data: CreateLotData): Promise<Lot> {
    const warehouseId = data.warehouseId ?? 'entrepotA';
    const warehouseName = warehouseId === 'entrepotA' ? 'Entrepôt A' : warehouseId;
    const lot = await this.prisma.lot.create({
      data: {
        reference: data.reference,
        warehouseId,
        warehouseName,
        countryCode: 'BR',
        productName: data.productName,
        producer: data.producer,
        harvestDate: new Date(data.harvestDate),
        storedAt: new Date(data.storedAt),
        quantityKg: data.quantityKg,
      },
    });
    return this.toModel(lot);
  }

  async update(id: string, data: UpdateLotData): Promise<Lot> {
    const lot = await this.prisma.lot.update({
      where: { id },
      data: {
        ...(data.reference !== undefined && { reference: data.reference }),
        ...(data.productName !== undefined && { productName: data.productName }),
        ...(data.producer !== undefined && { producer: data.producer }),
        ...(data.harvestDate !== undefined && { harvestDate: new Date(data.harvestDate) }),
        ...(data.storedAt !== undefined && { storedAt: new Date(data.storedAt) }),
        ...(data.quantityKg !== undefined && { quantityKg: data.quantityKg }),
      },
    });
    return this.toModel(lot);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.lot.delete({ where: { id } });
  }

  private toModel(lot: {
    id: string;
    reference: string;
    warehouseId: string;
    warehouseName: string;
    countryCode: string;
    productName: string;
    producer: string;
    harvestDate: Date;
    storedAt: Date;
    quantityKg: number;
  }): Lot {
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
