import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';

@Module({
  imports: [SharedModule],
  controllers: [AlertsController],
  providers: [AlertsService],
})
export class AlertsModule {}
