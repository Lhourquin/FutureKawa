import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlertsModule } from './alerts/alerts.module';
import { AuthModule } from './auth/auth.module';
import { CountriesModule } from './countries/countries.module';
import { HealthModule } from './health/health.module';
import { LotsModule } from './lots/lots.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    SharedModule,
    HealthModule,
    CountriesModule,
    LotsModule,
    AlertsModule,
  ],
})
export class AppModule {}
