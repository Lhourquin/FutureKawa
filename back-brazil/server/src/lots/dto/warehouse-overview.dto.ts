import { ApiProperty } from '@nestjs/swagger';

export class WarehouseOverviewDto {
  @ApiProperty() warehouseId!: string;
  @ApiProperty() warehouseName!: string;
  @ApiProperty() totalLots!: number;
  @ApiProperty() totalQuantityKg!: number;
  @ApiProperty() lotsInRange!: number;
  @ApiProperty() lotsOutOfRange!: number;
  @ApiProperty() lotsOverdue!: number;
  @ApiProperty({ nullable: true }) averageTemperatureC!: number | null;
  @ApiProperty({ nullable: true }) averageHumidityPercent!: number | null;
}
