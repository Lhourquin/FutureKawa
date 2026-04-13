import { Injectable } from '@nestjs/common';
import { CountryCode } from '../enums/country-code.enum';
import { Lot } from '../models/lot.model';
import { MOCK_LOTS } from '../data/mock-data';
import { LotRepository } from './lot.repository';

@Injectable()
export class InMemoryLotRepository extends LotRepository {
  async findById(id: string): Promise<Lot | null> {
    return MOCK_LOTS.find((lot) => lot.id === id) ?? null;
  }

  async findByCountryCode(countryCode: CountryCode): Promise<Lot[]> {
    return MOCK_LOTS.filter((lot) => lot.countryCode === countryCode);
  }

  async findAll(): Promise<Lot[]> {
    return [...MOCK_LOTS];
  }
}
