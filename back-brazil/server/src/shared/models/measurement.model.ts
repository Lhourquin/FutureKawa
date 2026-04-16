export interface Measurement {
  readonly id: string;
  readonly lotId: string;
  readonly sensor: string;
  readonly value: number;
  readonly unit: string;
  readonly receivedAt: string;
}
