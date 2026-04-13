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
    summary: 'Lister les alertes actives',
    description:
      "Retourne les alertes detectees par le siege: conditions hors plage ou stockage superieur a 365 jours. Cet endpoint sert a prioriser les actions de supervision et de traitement des risques.",
  })
  @ApiOkResponse({
    description: 'Liste des alertes calculees a partir des donnees mockees.',
    type: AlertDto,
    isArray: true,
  })
  getAlerts(): Promise<AlertDto[]> {
    return this.alertsService.getAlerts();
  }
}
