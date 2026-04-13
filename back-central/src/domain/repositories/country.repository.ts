import { CountryCode } from '../enums/country-code.enum';
import { Country } from '../models/country.model';

export const COUNTRY_REPOSITORY = Symbol('COUNTRY_REPOSITORY');

export abstract class CountryRepository {
  abstract findAll(): Promise<Country[]>;
  abstract findByCode(code: CountryCode): Promise<Country | null>;
}
