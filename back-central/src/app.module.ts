import { Module } from '@nestjs/common';
import { AlertsService } from './application/services/alerts.service';
import { CountriesService } from './application/services/countries.service';
import { HealthService } from './application/services/health.service';
import { LotsService } from './application/services/lots.service';
import { MonitoringService } from './application/services/monitoring.service';
import { CLOCK } from './domain/repositories/clock.repository';
import { COUNTRY_REPOSITORY } from './domain/repositories/country.repository';
import { LOT_REPOSITORY } from './domain/repositories/lot.repository';
import { MEASUREMENT_REPOSITORY } from './domain/repositories/measurement.repository';
import { InMemoryCountryRepository } from './infrastructure/persistence/in-memory/in-memory-country.repository';
import { InMemoryLotRepository } from './infrastructure/persistence/in-memory/in-memory-lot.repository';
import { InMemoryMeasurementRepository } from './infrastructure/persistence/in-memory/in-memory-measurement.repository';
import { SystemClock } from './infrastructure/time/system-clock.service';
import { AlertsController } from './presentation/controllers/alerts.controller';
import { CountriesController } from './presentation/controllers/countries.controller';
import { HealthController } from './presentation/controllers/health.controller';
import { LotsController } from './presentation/controllers/lots.controller';

@Module({
  imports: [],
  controllers: [
    HealthController,
    CountriesController,
    LotsController,
    AlertsController,
  ],
  providers: [
    AlertsService,
    HealthService,
    CountriesService,
    LotsService,
    MonitoringService,
    InMemoryCountryRepository,
    InMemoryLotRepository,
    InMemoryMeasurementRepository,
    SystemClock,
    {
      provide: COUNTRY_REPOSITORY,
      useExisting: InMemoryCountryRepository,
    },
    {
      provide: LOT_REPOSITORY,
      useExisting: InMemoryLotRepository,
    },
    {
      provide: MEASUREMENT_REPOSITORY,
      useExisting: InMemoryMeasurementRepository,
    },
    {
      provide: CLOCK,
      useExisting: SystemClock,
    },
  ],
})
export class AppModule {}
