import { CountryCode } from '../../../domain/enums/country-code.enum';
import { Country } from '../../../domain/models/country.model';
import { Lot } from '../../../domain/models/lot.model';
import { Measurement } from '../../../domain/models/measurement.model';

export interface InMemoryDataset {
  readonly countries: Country[];
  readonly lots: Lot[];
  readonly measurements: Measurement[];
}

export const IN_MEMORY_DATASET: InMemoryDataset = {
  countries: [
    {
      code: CountryCode.BR,
      name: 'Bresil',
      targetProfile: {
        targetTemperatureC: 29,
        targetHumidityPercent: 55,
        temperatureToleranceC: 3,
        humidityTolerancePercent: 2,
      },
    },
    {
      code: CountryCode.EC,
      name: 'Equateur',
      targetProfile: {
        targetTemperatureC: 31,
        targetHumidityPercent: 60,
        temperatureToleranceC: 3,
        humidityTolerancePercent: 2,
      },
    },
    {
      code: CountryCode.CO,
      name: 'Colombie',
      targetProfile: {
        targetTemperatureC: 26,
        targetHumidityPercent: 80,
        temperatureToleranceC: 3,
        humidityTolerancePercent: 2,
      },
    },
  ],
  lots: [
    {
      id: 'lot-br-001',
      countryCode: CountryCode.BR,
      reference: 'BR-2025-001',
      productName: 'Arabica Santos',
      producer: 'Cooperativa Vale Verde',
      harvestDate: '2025-05-12',
      storedAt: '2025-06-01T09:00:00.000Z',
      quantityKg: 1200,
    },
    {
      id: 'lot-br-002',
      countryCode: CountryCode.BR,
      reference: 'BR-2024-014',
      productName: 'Bourbon Jaune',
      producer: 'Fazenda Aurora',
      harvestDate: '2024-02-18',
      storedAt: '2024-03-10T08:30:00.000Z',
      quantityKg: 860,
    },
    {
      id: 'lot-ec-001',
      countryCode: CountryCode.EC,
      reference: 'EC-2025-008',
      productName: 'Typica Loja',
      producer: 'Finca Sierra Clara',
      harvestDate: '2025-11-04',
      storedAt: '2025-11-21T10:00:00.000Z',
      quantityKg: 940,
    },
    {
      id: 'lot-ec-002',
      countryCode: CountryCode.EC,
      reference: 'EC-2025-011',
      productName: 'Caturra Andina',
      producer: 'Altura del Sol',
      harvestDate: '2025-08-15',
      storedAt: '2025-09-02T14:15:00.000Z',
      quantityKg: 1110,
    },
    {
      id: 'lot-co-001',
      countryCode: CountryCode.CO,
      reference: 'CO-2024-021',
      productName: 'Supremo Huila',
      producer: 'Asociacion Rio Claro',
      harvestDate: '2024-01-28',
      storedAt: '2024-02-05T11:45:00.000Z',
      quantityKg: 1325,
    },
    {
      id: 'lot-co-002',
      countryCode: CountryCode.CO,
      reference: 'CO-2025-006',
      productName: 'Castillo Narino',
      producer: 'Finca Monte Azul',
      harvestDate: '2025-09-10',
      storedAt: '2025-09-26T07:20:00.000Z',
      quantityKg: 980,
    },
  ],
  measurements: [
    {
      id: 'mea-br-001-1',
      lotId: 'lot-br-001',
      measuredAt: '2026-04-10T08:00:00.000Z',
      temperatureC: 28.7,
      humidityPercent: 54.9,
    },
    {
      id: 'mea-br-001-2',
      lotId: 'lot-br-001',
      measuredAt: '2026-04-12T08:00:00.000Z',
      temperatureC: 29.4,
      humidityPercent: 55.1,
    },
    {
      id: 'mea-br-002-1',
      lotId: 'lot-br-002',
      measuredAt: '2026-04-10T10:30:00.000Z',
      temperatureC: 32.8,
      humidityPercent: 57.2,
    },
    {
      id: 'mea-br-002-2',
      lotId: 'lot-br-002',
      measuredAt: '2026-04-12T10:30:00.000Z',
      temperatureC: 33.4,
      humidityPercent: 58.5,
    },
    {
      id: 'mea-ec-001-1',
      lotId: 'lot-ec-001',
      measuredAt: '2026-04-12T09:15:00.000Z',
      temperatureC: 31.3,
      humidityPercent: 60,
    },
    {
      id: 'mea-ec-002-1',
      lotId: 'lot-ec-002',
      measuredAt: '2026-04-12T16:40:00.000Z',
      temperatureC: 35,
      humidityPercent: 64,
    },
    {
      id: 'mea-co-001-1',
      lotId: 'lot-co-001',
      measuredAt: '2026-04-12T07:50:00.000Z',
      temperatureC: 25.9,
      humidityPercent: 81.1,
    },
    {
      id: 'mea-co-002-1',
      lotId: 'lot-co-002',
      measuredAt: '2026-04-12T13:25:00.000Z',
      temperatureC: 26,
      humidityPercent: 79.9,
    },
  ],
};
