import { Inject, Injectable } from '@nestjs/common';
import {
  CLOCK,
  ClockRepository,
} from '../shared/repositories/clock.repository';
import { HealthDto } from './dto/health.dto';

@Injectable()
export class HealthService {
  constructor(
    @Inject(CLOCK) private readonly clockRepository: ClockRepository,
  ) {}

  getHealth(): HealthDto {
    return {
      status: 'ok',
      timestamp: this.clockRepository.now().toISOString(),
    };
  }
}
