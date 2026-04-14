import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SystemClockProvider } from './providers/system-clock.provider';
import { CLOCK } from './repositories/clock.repository';
import { LOT_REPOSITORY } from './repositories/lot.repository';
import { MEASUREMENT_REPOSITORY } from './repositories/measurement.repository';
import { PrismaLotRepository } from './repositories/prisma-lot.repository';
import { PrismaMeasurementRepository } from './repositories/prisma-measurement.repository';
import { MonitoringService } from './services/monitoring.service';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [
    MonitoringService,
    PrismaLotRepository,
    PrismaMeasurementRepository,
    SystemClockProvider,
    {
      provide: LOT_REPOSITORY,
      useExisting: PrismaLotRepository,
    },
    {
      provide: MEASUREMENT_REPOSITORY,
      useExisting: PrismaMeasurementRepository,
    },
    {
      provide: CLOCK,
      useExisting: SystemClockProvider,
    },
  ],
  exports: [MonitoringService, LOT_REPOSITORY, MEASUREMENT_REPOSITORY, CLOCK],
})
export class SharedModule {}
