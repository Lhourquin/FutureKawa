import { Lot } from '../models/lot.model';

export const LOT_REPOSITORY = Symbol('LOT_REPOSITORY');

export abstract class LotRepository {
  abstract findAll(): Promise<Lot[]>;
  abstract findById(id: string): Promise<Lot | null>;
}
