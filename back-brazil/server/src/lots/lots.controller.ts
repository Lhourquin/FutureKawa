import {
  Body, Controller, Delete, Get, HttpCode, Param, Patch, Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse,
  ApiOkResponse, ApiOperation, ApiParam, ApiTags,
} from '@nestjs/swagger';
import { CreateLotDto } from './dto/create-lot.dto';
import { LotDetailDto } from './dto/lot-detail.dto';
import { LotSummaryDto } from './dto/lot-summary.dto';
import { MeasurementHistoryItemDto } from './dto/measurement-history-item.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { WarehouseOverviewDto } from './dto/warehouse-overview.dto';
import { LotsService } from './lots.service';

@ApiTags('Lots')
@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des lots (ordre FIFO — date entrée stockage)' })
  @ApiOkResponse({ type: LotSummaryDto, isArray: true })
  getLots(): Promise<LotSummaryDto[]> {
    return this.lotsService.getLots();
  }

  @Get('warehouses')
  @ApiOperation({ summary: "Vue consolidée par entrepôt (agrégée depuis les lots)" })
  @ApiOkResponse({ type: WarehouseOverviewDto, isArray: true })
  getWarehouses(): Promise<WarehouseOverviewDto[]> {
    return this.lotsService.getWarehouses();
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Créer un nouveau lot' })
  @ApiCreatedResponse({ type: LotDetailDto })
  createLot(@Body() dto: CreateLotDto): Promise<LotDetailDto> {
    return this.lotsService.createLot(dto);
  }

  @Get(':lotId')
  @ApiOperation({ summary: "Détail d'un lot" })
  @ApiParam({ name: 'lotId' })
  @ApiOkResponse({ type: LotDetailDto })
  @ApiNotFoundResponse()
  getLotDetail(@Param('lotId') lotId: string): Promise<LotDetailDto> {
    return this.lotsService.getLotDetail(lotId);
  }

  @Patch(':lotId')
  @ApiOperation({ summary: 'Modifier un lot' })
  @ApiParam({ name: 'lotId' })
  @ApiOkResponse({ type: LotDetailDto })
  @ApiNotFoundResponse()
  updateLot(
    @Param('lotId') lotId: string,
    @Body() dto: UpdateLotDto,
  ): Promise<LotDetailDto> {
    return this.lotsService.updateLot(lotId, dto);
  }

  @Delete(':lotId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Supprimer un lot (cascade mesures IoT)' })
  @ApiParam({ name: 'lotId' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  deleteLot(@Param('lotId') lotId: string): Promise<void> {
    return this.lotsService.deleteLot(lotId);
  }

  @Get(':lotId/measurements')
  @ApiOperation({ summary: "Historique des mesures IoT d'un lot" })
  @ApiParam({ name: 'lotId' })
  @ApiOkResponse({ type: MeasurementHistoryItemDto, isArray: true })
  @ApiNotFoundResponse()
  getMeasurements(@Param('lotId') lotId: string): Promise<MeasurementHistoryItemDto[]> {
    return this.lotsService.getMeasurements(lotId);
  }
}
