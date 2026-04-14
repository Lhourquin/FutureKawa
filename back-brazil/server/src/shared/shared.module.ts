import { Global, Module } from '@nestjs/common';
import { SystemClockProvider } from './providers/system-clock.provider';
import { CLOCK } from './repositories/clock.repository';
import { InMemoryLotRepository } from './repositories/in-memory-lot.repository';
import { InMemoryMeasurementRepository } from './repositories/in-memory-measurement.repository';
import { LOT_REPOSITORY } from './repositories/lot.repository';
import { MEASUREMENT_REPOSITORY } from './repositories/measurement.repository';
import { MonitoringService } from './services/monitoring.service';

@Global()
@Module({
  providers: [
    MonitoringService,
    InMemoryLotRepository,
    InMemoryMeasurementRepository,
    SystemClockProvider,
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
  exports: [MonitoringService, LOT_REPOSITORY, MEASUREMENT_REPOSITORY, CLOCK],
})
export class SharedModule {}
