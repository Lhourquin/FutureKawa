import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthDto } from '../../application/dto/health.dto';
import { HealthService } from '../../application/services/health.service';

@ApiTags('Santé')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: "Verifier que l'API centrale repond",
    description:
      "Retourne un statut simple pour confirmer que le backend du siege est demarre et joignable. Cet endpoint sert au diagnostic technique et au controle d'exploitation.",
  })
  @ApiOkResponse({
    description: "L'API est disponible et repond correctement.",
    type: HealthDto,
  })
  getHealth(): HealthDto {
    return this.healthService.getHealth();
  }
}
