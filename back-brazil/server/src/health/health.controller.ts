import { Controller, Get } from '@nestjs/common';
import { HealthDto } from './dto/health.dto';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth(): HealthDto {
    return this.healthService.getHealth();
  }
}
