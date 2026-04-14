import { Injectable } from '@nestjs/common';
import { MOCK_LOTS } from '../data/mock-data';
import { Lot } from '../models/lot.model';
import { LotRepository } from './lot.repository';

@Injectable()
export class InMemoryLotRepository extends LotRepository {
  async findAll(): Promise<Lot[]> {
    return [...MOCK_LOTS];
  }

  async findById(id: string): Promise<Lot | null> {
    return MOCK_LOTS.find((lot) => lot.id === id) ?? null;
  }
}
