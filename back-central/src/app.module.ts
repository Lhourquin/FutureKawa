import { Module } from '@nestjs/common';
import { AlertsModule } from './alerts/alerts.module';
import { CountriesModule } from './countries/countries.module';
import { HealthModule } from './health/health.module';
import { LotsModule } from './lots/lots.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    SharedModule,
    HealthModule,
    CountriesModule,
    LotsModule,
    AlertsModule,
  ],
})
export class AppModule {}
