import { Injectable } from '@nestjs/common';
import { CountryCode } from '../enums/country-code.enum';
import { Country } from '../models/country.model';
import { CountryRepository } from './country.repository';
import { MOCK_COUNTRIES } from '../data/mock-data';

@Injectable()
export class InMemoryCountryRepository extends CountryRepository {
  async findAll(): Promise<Country[]> {
    return [...MOCK_COUNTRIES];
  }

  async findByCode(code: CountryCode): Promise<Country | null> {
    return MOCK_COUNTRIES.find((country) => country.code === code) ?? null;
  }
}
