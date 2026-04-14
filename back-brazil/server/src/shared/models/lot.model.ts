export interface Lot {
  readonly id: string;
  readonly reference: string;
  readonly warehouseId: string;
  readonly warehouseName: string;
  readonly countryCode: 'BR';
  readonly productName: string;
  readonly producer: string;
  readonly harvestDate: string;
  readonly storedAt: string;
  readonly quantityKg: number;
}
