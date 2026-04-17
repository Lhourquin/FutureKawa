import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateLotDto {
  @ApiProperty({ example: 'BR-2025-003' })
  @IsString()
  reference!: string;

  @ApiPropertyOptional({ example: 'entrepotA', default: 'entrepotA' })
  @IsString()
  @IsOptional()
  warehouseId?: string;

  @ApiProperty({ example: 'Arabica Santos' })
  @IsString()
  productName!: string;

  @ApiProperty({ example: 'Cooperativa Vale Verde' })
  @IsString()
  producer!: string;

  @ApiProperty({ example: '2025-05-12' })
  @IsDateString()
  harvestDate!: string;

  @ApiProperty({ example: '2025-06-01' })
  @IsDateString()
  storedAt!: string;

  @ApiProperty({ example: 1200 })
  @IsNumber()
  @Min(1)
  quantityKg!: number;
}
