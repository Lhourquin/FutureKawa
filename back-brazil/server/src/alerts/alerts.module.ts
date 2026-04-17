import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { SharedModule } from '../shared/shared.module';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';

@Module({
  imports: [SharedModule, NotificationsModule],
  controllers: [AlertsController],
  providers: [AlertsService],
})
export class AlertsModule {}
