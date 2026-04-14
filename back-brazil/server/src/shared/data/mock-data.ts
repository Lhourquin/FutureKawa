import { Lot } from '../models/lot.model';
import { Measurement } from '../models/measurement.model';

export const BRAZIL_TARGETS = {
  countryCode: 'BR' as const,
  countryName: 'Bresil',
  targetTemperatureC: 29,
  targetHumidityPercent: 55,
  temperatureToleranceC: 3,
  humidityTolerancePercent: 2,
};

export const MOCK_LOTS: Lot[] = [
  {
    id: 'lot-br-001',
    reference: 'BR-2025-001',
    warehouseId: 'br-warehouse-1',
    warehouseName: 'Entrepot Santos',
    countryCode: 'BR',
    productName: 'Arabica Santos',
    producer: 'Cooperativa Vale Verde',
    harvestDate: '2025-05-12',
    storedAt: '2025-06-01T09:00:00.000Z',
    quantityKg: 1200,
  },
  {
    id: 'lot-br-002',
    reference: 'BR-2024-014',
    warehouseId: 'br-warehouse-1',
    warehouseName: 'Entrepot Santos',
    countryCode: 'BR',
    productName: 'Bourbon Jaune',
    producer: 'Fazenda Aurora',
    harvestDate: '2024-02-18',
    storedAt: '2024-03-10T08:30:00.000Z',
    quantityKg: 860,
  },
];

export const MOCK_MEASUREMENTS: Measurement[] = [
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
];
