import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlertsModule } from './alerts/alerts.module';
import { HealthModule } from './health/health.module';
import { LotsModule } from './lots/lots.module';
import { MqttDebugModule } from './mqtt-debug/mqtt-debug.module';
import { PrismaModule } from './prisma/prisma.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    SharedModule,
    HealthModule,
    LotsModule,
    AlertsModule,
    MqttDebugModule,
  ],
})
export class AppModule {}
