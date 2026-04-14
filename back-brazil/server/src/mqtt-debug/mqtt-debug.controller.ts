import { Controller, Get } from '@nestjs/common';
import { MqttMessageDto } from './dto/mqtt-message.dto';
import { MqttStatusDto } from './dto/mqtt-status.dto';
import { MqttDebugService } from './mqtt-debug.service';

@Controller('mqtt')
export class MqttDebugController {
  constructor(private readonly mqttDebugService: MqttDebugService) {}

  @Get('status')
  getStatus(): MqttStatusDto {
    return this.mqttDebugService.getStatus();
  }

  @Get('messages')
  getMessages(): MqttMessageDto[] {
    return this.mqttDebugService.getMessages();
  }

  @Get('messages/latest')
  getLatestMessage(): MqttMessageDto | null {
    return this.mqttDebugService.getLatestMessage();
  }
}
