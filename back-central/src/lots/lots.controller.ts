import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { LotDetailDto } from './dto/lot-detail.dto';
import { MeasurementHistoryItemDto } from './dto/measurement-history-item.dto';
import { LotsService } from './lots.service';

@ApiTags('Lots')
@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Get(':lotId')
  @ApiOperation({
    summary: "Consulter le detail d'un lot",
    description:
      "Retourne les informations completes d'un lot, son pays de rattachement, son anciennete de stockage et son dernier etat environnemental connu. Cet endpoint sert a l'analyse fine d'un lot depuis le siege.",
  })
  @ApiParam({
    name: 'lotId',
    description: 'Identifiant technique du lot.',
    example: 'lot-br-001',
  })
  @ApiOkResponse({
    description: 'Detail complet du lot demande.',
    type: LotDetailDto,
  })
  @ApiNotFoundResponse({
    description: "Le lot demande n'existe pas.",
  })
  getLotDetail(@Param('lotId') lotId: string): Promise<LotDetailDto> {
    return this.lotsService.getLotDetail(lotId);
  }

  @Get(':lotId/measurements')
  @ApiOperation({
    summary: "Consulter l'historique des mesures d'un lot",
    description:
      "Retourne l'historique des releves de temperature et d'humidite pour un lot. Cet endpoint sert a comprendre l'evolution des conditions de stockage dans le temps.",
  })
  @ApiParam({
    name: 'lotId',
    description: 'Identifiant technique du lot.',
    example: 'lot-br-001',
  })
  @ApiOkResponse({
    description: 'Historique des mesures du lot.',
    type: MeasurementHistoryItemDto,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: "Le lot demande n'existe pas.",
  })
  getMeasurements(
    @Param('lotId') lotId: string,
  ): Promise<MeasurementHistoryItemDto[]> {
    return this.lotsService.getMeasurements(lotId);
  }
}
