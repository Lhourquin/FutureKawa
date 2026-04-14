import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mqtt, { MqttClient } from 'mqtt';
import { MqttMessageDto } from './dto/mqtt-message.dto';
import { MqttStatusDto } from './dto/mqtt-status.dto';

@Injectable()
export class MqttDebugService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttDebugService.name);
  private client: MqttClient | null = null;
  private connected = false;
  private readonly messages: MqttMessageDto[] = [];
  private readonly brokerUrl: string;
  private readonly topic: string;
  private readonly clientId: string;

  constructor(private readonly configService: ConfigService) {
    this.brokerUrl =
      this.configService.get<string>('MQTT_URL') ?? 'mqtt://127.0.0.1:1883';
    this.topic =
      this.configService.get<string>('MQTT_MEASUREMENTS_TOPIC') ??
      'futurekawa/br/warehouse-1/measurements';
    this.clientId =
      this.configService.get<string>('MQTT_CLIENT_ID') ??
      'futurekawa-br-backend';
  }

  onModuleInit(): void {
    this.client = mqtt.connect(this.brokerUrl, {
      clientId: this.clientId,
    });

    this.client.on('connect', () => {
      this.connected = true;
      this.logger.log(`Connected to MQTT broker at ${this.brokerUrl}`);

      this.client?.subscribe(this.topic, (error?: Error | null) => {
        if (error) {
          this.logger.error(`Failed to subscribe to topic ${this.topic}`, error);
          return;
        }

        this.logger.log(`Subscribed to topic ${this.topic}`);
      });
    });

    this.client.on('reconnect', () => {
      this.logger.warn('Reconnecting to MQTT broker...');
    });

    this.client.on('close', () => {
      this.connected = false;
      this.logger.warn('MQTT connection closed');
    });

    this.client.on('error', (error: Error) => {
      this.logger.error('MQTT client error', error);
    });

    this.client.on('message', (topic: string, payload: Buffer) => {
      const message: MqttMessageDto = {
        topic,
        receivedAt: new Date().toISOString(),
        payload: payload.toString(),
      };

      this.messages.unshift(message);
      this.messages.splice(10);

      this.logger.log(`Received MQTT message on ${topic}: ${message.payload}`);
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.client) {
      return;
    }

    await new Promise<void>((resolve) => {
      this.client?.end(false, {}, () => resolve());
    });
  }

  getStatus(): MqttStatusDto {
    return {
      connected: this.connected,
      brokerUrl: this.brokerUrl,
      topic: this.topic,
      clientId: this.clientId,
      receivedMessagesCount: this.messages.length,
      lastMessageAt: this.messages[0]?.receivedAt ?? null,
    };
  }

  getMessages(): MqttMessageDto[] {
    return [...this.messages];
  }

  getLatestMessage(): MqttMessageDto | null {
    return this.messages[0] ?? null;
  }
}
