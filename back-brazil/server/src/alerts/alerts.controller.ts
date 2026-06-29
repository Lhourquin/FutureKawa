import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AlertDto } from './dto/alert.dto';
import { AlertsService } from './alerts.service';

@ApiTags('Alertes')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @ApiOperation({
    summary: 'Alertes actives',
    description:
      'Calcul à la demande : conditions hors plage (±3°C/±2%) et lots > 365 j. Les alertes sont aussi déclenchées en temps réel via EventEmitter après chaque ingestion MQTT.',
  })
  @ApiOkResponse({ type: AlertDto, isArray: true })
  getAlerts(): Promise<AlertDto[]> {
    return this.alertsService.getAlerts();
  }
}
