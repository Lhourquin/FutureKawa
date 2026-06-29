import { Lot } from '../models/lot.model';

export const LOT_REPOSITORY = Symbol('LOT_REPOSITORY');

export interface CreateLotData {
  reference: string;
  warehouseId?: string;
  productName: string;
  producer: string;
  harvestDate: string;
  storedAt: string;
  quantityKg: number;
}

export interface UpdateLotData {
  reference?: string;
  productName?: string;
  producer?: string;
  harvestDate?: string;
  storedAt?: string;
  quantityKg?: number;
}

export abstract class LotRepository {
  abstract findAll(): Promise<Lot[]>;
  abstract findById(id: string): Promise<Lot | null>;
  abstract findByWarehouseId(warehouseId: string): Promise<Lot[]>;
  abstract create(data: CreateLotData): Promise<Lot>;
  abstract update(id: string, data: UpdateLotData): Promise<Lot>;
  abstract delete(id: string): Promise<void>;
}
