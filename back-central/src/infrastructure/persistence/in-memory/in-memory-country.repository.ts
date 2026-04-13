import { Injectable } from '@nestjs/common';
import { CountryCode } from '../../../domain/enums/country-code.enum';
import { Country } from '../../../domain/models/country.model';
import { CountryRepository } from '../../../domain/repositories/country.repository';
import { IN_MEMORY_DATASET } from './in-memory-dataset';

@Injectable()
export class InMemoryCountryRepository extends CountryRepository {
  async findAll(): Promise<Country[]> {
    return [...IN_MEMORY_DATASET.countries];
  }

  async findByCode(code: CountryCode): Promise<Country | null> {
    return (
      IN_MEMORY_DATASET.countries.find((country) => country.code === code) ?? null
    );
  }
}
