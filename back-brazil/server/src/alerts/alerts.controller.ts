import { Controller, Get } from '@nestjs/common';
import { AlertDto } from './dto/alert.dto';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  getAlerts(): Promise<AlertDto[]> {
    return this.alertsService.getAlerts();
  }
}
