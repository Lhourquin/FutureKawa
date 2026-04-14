import { Module } from '@nestjs/common';
import { AlertsModule } from './alerts/alerts.module';
import { HealthModule } from './health/health.module';
import { LotsModule } from './lots/lots.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule, HealthModule, LotsModule, AlertsModule],
})
export class AppModule {}
