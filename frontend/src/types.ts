export interface Country {
  code: 'BR' | 'EC' | 'CO';
  name: string;
  targetTemperatureC: number;
  targetHumidityPercent: number;
  temperatureToleranceC: number;
  humidityTolerancePercent: number;
}

export interface CountryOverview {
  countryCode: string;
  countryName: string;
  totalLots: number;
  lotsInRange: number;
  lotsOutOfRange: number;
  lotsStoredOver365Days: number;
  averageLatestTemperatureC: number | null;
  averageLatestHumidityPercent: number | null;
}

export interface LotSummary {
  id: string;
  reference: string;
  countryCode: string;
  productName: string;
  producer: string;
  quantityKg: number;
  storedAt: string;
  storageDays: number;
  latestTemperatureC: number | null;
  latestHumidityPercent: number | null;
  conditionsInRange: boolean | null;
}

export interface LotDetail extends LotSummary {
  countryName: string;
  harvestDate: string;
  latestMeasuredAt: string | null;
}

export interface MeasurementItem {
  id: string;
  sensor: string;
  value: number;
  unit: string;
  measuredAt: string;
}

export interface WarehouseOverview {
  warehouseId: string;
  warehouseName: string;
  totalLots: number;
  totalQuantityKg: number;
  lotsInRange: number;
  lotsOutOfRange: number;
  lotsOverdue: number;
  averageTemperatureC: number | null;
  averageHumidityPercent: number | null;
}

export interface CreateLotInput {
  reference: string;
  productName: string;
  producer: string;
  harvestDate: string;
  storedAt: string;
  quantityKg: number;
}

export type UpdateLotInput = Partial<CreateLotInput>;

export interface Alert {
  id: string;
  type: 'CONDITIONS_OUT_OF_RANGE' | 'STORAGE_DURATION_EXCEEDED';
  severity: 'CRITICAL' | 'WARNING';
  message: string;
  detectedAt: string;
  lotId: string;
  lotReference: string;
  countryCode?: string;
  countryName?: string;
}
