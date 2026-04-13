import { Injectable } from '@nestjs/common';
import { CountryCode } from '../../../domain/enums/country-code.enum';
import { Lot } from '../../../domain/models/lot.model';
import { LotRepository } from '../../../domain/repositories/lot.repository';
import { IN_MEMORY_DATASET } from './in-memory-dataset';

@Injectable()
export class InMemoryLotRepository extends LotRepository {
  async findById(id: string): Promise<Lot | null> {
    return IN_MEMORY_DATASET.lots.find((lot) => lot.id === id) ?? null;
  }

  async findByCountryCode(countryCode: CountryCode): Promise<Lot[]> {
    return IN_MEMORY_DATASET.lots.filter((lot) => lot.countryCode === countryCode);
  }
}
