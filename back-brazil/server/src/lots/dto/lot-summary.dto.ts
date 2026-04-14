export class LotSummaryDto {
  id!: string;
  reference!: string;
  warehouseId!: string;
  warehouseName!: string;
  countryCode!: 'BR';
  productName!: string;
  producer!: string;
  quantityKg!: number;
  storedAt!: string;
  storageDays!: number;
  latestTemperatureC!: number | null;
  latestHumidityPercent!: number | null;
  conditionsInRange!: boolean | null;
}
