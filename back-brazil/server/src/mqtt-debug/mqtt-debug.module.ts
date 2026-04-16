import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { MqttDebugController } from './mqtt-debug.controller';
import { MqttDebugService } from './mqtt-debug.service';

@Module({
  imports: [SharedModule],
  controllers: [MqttDebugController],
  providers: [MqttDebugService],
})
export class MqttDebugModule {}
