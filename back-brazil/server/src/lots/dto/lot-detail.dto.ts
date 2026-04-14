export class LotDetailDto {
  id!: string;
  reference!: string;
  warehouseId!: string;
  warehouseName!: string;
  countryCode!: 'BR';
  productName!: string;
  producer!: string;
  harvestDate!: string;
  storedAt!: string;
  storageDays!: number;
  quantityKg!: number;
  latestTemperatureC!: number | null;
  latestHumidityPercent!: number | null;
  latestMeasuredAt!: string | null;
  conditionsInRange!: boolean | null;
}
