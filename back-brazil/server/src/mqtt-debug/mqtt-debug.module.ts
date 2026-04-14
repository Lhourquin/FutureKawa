import { Module } from '@nestjs/common';
import { MqttDebugController } from './mqtt-debug.controller';
import { MqttDebugService } from './mqtt-debug.service';

@Module({
  controllers: [MqttDebugController],
  providers: [MqttDebugService],
})
export class MqttDebugModule {}
