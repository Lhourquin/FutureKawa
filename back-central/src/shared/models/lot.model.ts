import { CountryCode } from '../enums/country-code.enum';

export interface Lot {
  readonly id: string;
  readonly countryCode: CountryCode;
  readonly reference: string;
  readonly productName: string;
  readonly producer: string;
  readonly harvestDate: string;
  readonly storedAt: string;
  readonly quantityKg: number;
}
