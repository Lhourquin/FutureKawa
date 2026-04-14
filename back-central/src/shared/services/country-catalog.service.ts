import { Injectable } from '@nestjs/common';
import { COUNTRIES_CATALOG } from '../config/countries.config';
import { CountryCode } from '../enums/country-code.enum';
import { Country } from '../models/country.model';

@Injectable()
export class CountryCatalogService {
  getAll(): Country[] {
    return [...COUNTRIES_CATALOG];
  }

  getByCode(code: CountryCode): Country | null {
    return COUNTRIES_CATALOG.find((country) => country.code === code) ?? null;
  }
}
