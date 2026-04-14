import { Injectable } from '@nestjs/common';
import { ClockRepository } from '../repositories/clock.repository';

@Injectable()
export class SystemClockProvider extends ClockRepository {
  now(): Date {
    return new Date();
  }
}
