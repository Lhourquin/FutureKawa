export interface Measurement {
  readonly id: string;
  readonly lotId: string;
  readonly measuredAt: string;
  readonly temperatureC: number;
  readonly humidityPercent: number;
}
