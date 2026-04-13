import { Global, Module } from '@nestjs/common';
import { MonitoringService } from './services/monitoring.service';
import { CLOCK } from './repositories/clock.repository';
import { COUNTRY_REPOSITORY } from './repositories/country.repository';
import { LOT_REPOSITORY } from './repositories/lot.repository';
import { MEASUREMENT_REPOSITORY } from './repositories/measurement.repository';
import { InMemoryCountryRepository } from './repositories/in-memory-country.repository';
import { InMemoryLotRepository } from './repositories/in-memory-lot.repository';
import { InMemoryMeasurementRepository } from './repositories/in-memory-measurement.repository';
import { SystemClockProvider } from './providers/system-clock.provider';

@Global()
@Module({
  providers: [
    MonitoringService,
    InMemoryCountryRepository,
    InMemoryLotRepository,
    InMemoryMeasurementRepository,
    SystemClockProvider,
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
      useExisting: SystemClockProvider,
    },
  ],
  exports: [
    MonitoringService,
    COUNTRY_REPOSITORY,
    LOT_REPOSITORY,
    MEASUREMENT_REPOSITORY,
    CLOCK,
  ],
})
export class SharedModule {}
