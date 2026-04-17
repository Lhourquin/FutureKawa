import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AlertsModule } from './alerts/alerts.module';
import { HealthModule } from './health/health.module';
import { LotsModule } from './lots/lots.module';
import { MqttDebugModule } from './mqtt-debug/mqtt-debug.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaModule } from './prisma/prisma.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    PrismaModule,
    SharedModule,
    NotificationsModule,
    HealthModule,
    LotsModule,
    AlertsModule,
    MqttDebugModule,
  ],
})
export class AppModule {}
