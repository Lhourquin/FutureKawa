import { Global, Module } from '@nestjs/common';
import { BrazilBackendClient } from './clients/brazil-backend.client';
import { CountryCatalogService } from './services/country-catalog.service';
import { SystemClockProvider } from './providers/system-clock.provider';
import { CLOCK } from './repositories/clock.repository';

@Global()
@Module({
  providers: [
    BrazilBackendClient,
    CountryCatalogService,
    SystemClockProvider,
    {
      provide: CLOCK,
      useExisting: SystemClockProvider,
    },
  ],
  exports: [
    BrazilBackendClient,
    CountryCatalogService,
    CLOCK,
  ],
})
export class SharedModule {}
