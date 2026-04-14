import { Controller, Get, Param } from '@nestjs/common';
import { LotsService } from './lots.service';
import { LotDetailDto } from './dto/lot-detail.dto';
import { LotSummaryDto } from './dto/lot-summary.dto';
import { MeasurementHistoryItemDto } from './dto/measurement-history-item.dto';

@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Get()
  getLots(): Promise<LotSummaryDto[]> {
    return this.lotsService.getLots();
  }

  @Get(':lotId')
  getLotDetail(@Param('lotId') lotId: string): Promise<LotDetailDto> {
    return this.lotsService.getLotDetail(lotId);
  }

  @Get(':lotId/measurements')
  getMeasurements(
    @Param('lotId') lotId: string,
  ): Promise<MeasurementHistoryItemDto[]> {
    return this.lotsService.getMeasurements(lotId);
  }
}
