import { Inject, Injectable } from '@nestjs/common';
import { CLOCK, Clock } from '../../domain/repositories/clock.repository';
import { HealthDto } from '../dto/health.dto';

@Injectable()
export class HealthService {
  constructor(@Inject(CLOCK) private readonly clock: Clock) {}

  getHealth(): HealthDto {
    return {
      status: 'ok',
      timestamp: this.clock.now().toISOString(),
    };
  }
}
