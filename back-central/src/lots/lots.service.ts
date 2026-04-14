import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LotDetailDto } from './dto/lot-detail.dto';
import { MeasurementHistoryItemDto } from './dto/measurement-history-item.dto';
import { BrazilBackendClient } from '../shared/clients/brazil-backend.client';

@Injectable()
export class LotsService {
  constructor(private readonly brazilBackendClient: BrazilBackendClient) {}

  async getLotDetail(lotId: string): Promise<LotDetailDto> {
    if (lotId.startsWith('lot-br-')) {
      return this.brazilBackendClient.getLotDetail(lotId);
    }

    if (lotId.startsWith('lot-')) {
      throw new BadGatewayException(
        `Country backend for lot ${lotId} is not available yet`,
      );
    }

    throw new NotFoundException(`Lot ${lotId} not found`);
  }

  async getMeasurements(lotId: string): Promise<MeasurementHistoryItemDto[]> {
    if (lotId.startsWith('lot-br-')) {
      return this.brazilBackendClient.getMeasurements(lotId);
    }

    if (lotId.startsWith('lot-')) {
      throw new BadGatewayException(
        `Country backend for lot ${lotId} is not available yet`,
      );
    }

    throw new NotFoundException(`Lot ${lotId} not found`);
  }
}
