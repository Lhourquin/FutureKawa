import { CountryCode } from '../enums/country-code.enum';
import { Lot } from '../models/lot.model';

export const LOT_REPOSITORY = Symbol('LOT_REPOSITORY');

export abstract class LotRepository {
  abstract findById(id: string): Promise<Lot | null>;
  abstract findByCountryCode(countryCode: CountryCode): Promise<Lot[]>;
  abstract findAll(): Promise<Lot[]>;
}
