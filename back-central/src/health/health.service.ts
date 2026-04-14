import { Inject, Injectable } from '@nestjs/common';
import { HealthDto } from './dto/health.dto';
import { CLOCK, ClockRepository } from '../shared/repositories/clock.repository';

@Injectable()
export class HealthService {
  constructor(@Inject(CLOCK) private readonly clockRepository: ClockRepository) {}

  getHealth(): HealthDto {
    return {
      status: 'ok',
      timestamp: this.clockRepository.now().toISOString(),
    };
  }
}
