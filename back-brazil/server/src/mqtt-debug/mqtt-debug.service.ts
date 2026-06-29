import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import mqtt, { MqttClient } from 'mqtt';
import { PrismaService } from '../prisma/prisma.service';
import {
  LOT_REPOSITORY,
  LotRepository,
} from '../shared/repositories/lot.repository';
import {
  MEASUREMENT_REPOSITORY,
  MeasurementRepository,
} from '../shared/repositories/measurement.repository';
import { MeasurementIngestedEvent } from '../alerts/alerts.service';
import { MqttMessageDto } from './dto/mqtt-message.dto';
import { MqttStatusDto } from './dto/mqtt-status.dto';

interface SensorPayload {
  country: string;
  warehouse: string;
  sensor: string;
  value: number;
  unit: string;
  timeserie: number;
}

@Injectable()
export class MqttDebugService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttDebugService.name);
  private client: MqttClient | null = null;
  private connected = false;
  private readonly recentMessages: MqttMessageDto[] = [];
  private readonly brokerUrl: string;
  private readonly topic: string;
  private readonly clientId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    @Inject(LOT_REPOSITORY) private readonly lotRepository: LotRepository,
    @Inject(MEASUREMENT_REPOSITORY)
    private readonly measurementRepository: MeasurementRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.brokerUrl =
      configService.get<string>('MQTT_URL') ?? 'mqtt://127.0.0.1:1883';
    this.topic =
      configService.get<string>('MQTT_MEASUREMENTS_TOPIC') ??
      'futurekawa/+/+/sensors/+';
    this.clientId =
      configService.get<string>('MQTT_CLIENT_ID') ?? 'futurekawa-br-backend';
  }

  onModuleInit(): void {
    this.client = mqtt.connect(this.brokerUrl, { clientId: this.clientId });

    this.client.on('connect', () => {
      this.connected = true;
      this.logger.log(`Connecté au broker MQTT ${this.brokerUrl}`);
      this.client?.subscribe(this.topic, (err) => {
        if (err) {
          this.logger.error(`Échec souscription ${this.topic}`, err);
        } else {
          this.logger.log(`Souscrit au topic ${this.topic}`);
        }
      });
    });

    this.client.on('reconnect', () => this.logger.warn('Reconnexion MQTT…'));
    this.client.on('close', () => {
      this.connected = false;
      this.logger.warn('Connexion MQTT fermée');
    });
    this.client.on('error', (err) =>
      this.logger.error('Erreur client MQTT', err),
    );

    this.client.on('message', (topic: string, payload: Buffer) => {
      const raw = payload.toString();
      const message: MqttMessageDto = {
        topic,
        receivedAt: new Date().toISOString(),
        payload: raw,
      };
      this.recentMessages.unshift(message);
      this.recentMessages.splice(20);
      this.logger.log(`[MQTT] ${topic}: ${raw}`);
      void this.ingest(topic, raw);
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.client) return;
    await new Promise<void>((resolve) => {
      this.client?.end(false, {}, () => resolve());
    });
  }

  private async ingest(topic: string, raw: string): Promise<void> {
    let data: SensorPayload;
    try {
      data = JSON.parse(raw) as SensorPayload;
    } catch {
      this.logger.warn(`Payload non parsable sur ${topic}: ${raw}`);
      return;
    }

    // 1. Trace brute dans SensorLog
    await this.prisma.sensorLog
      .create({
        data: {
          topic,
          country: data.country,
          warehouse: data.warehouse,
          sensor: data.sensor,
          value: data.value,
          unit: data.unit,
          timeserie: data.timeserie,
        },
      })
      .catch((err: unknown) => this.logger.error('[DB] Échec SensorLog', err));

    // 2. Créer une Measurement par lot présent dans l'entrepôt
    const lots = await this.lotRepository.findByWarehouseId(data.warehouse);
    if (lots.length === 0) {
      this.logger.debug(`Aucun lot trouvé pour warehouse=${data.warehouse}`);
      return;
    }

    for (const lot of lots) {
      try {
        await this.measurementRepository.create({
          lotId: lot.id,
          sensor: data.sensor,
          value: data.value,
          unit: data.unit,
        });

        const event: MeasurementIngestedEvent = { lotId: lot.id };
        this.eventEmitter.emit('measurement.ingested', event);
        this.logger.debug(
          `[DB] Measurement créée — lot ${lot.reference}, ${data.sensor}=${data.value}${data.unit}`,
        );
      } catch (err: unknown) {
        this.logger.error(`[DB] Échec Measurement lot ${lot.id}`, err);
      }
    }
  }

  getStatus(): MqttStatusDto {
    return {
      connected: this.connected,
      brokerUrl: this.brokerUrl,
      topic: this.topic,
      clientId: this.clientId,
      receivedMessagesCount: this.recentMessages.length,
      lastMessageAt: this.recentMessages[0]?.receivedAt ?? null,
    };
  }

  getMessages(): MqttMessageDto[] {
    return [...this.recentMessages];
  }

  getLatestMessage(): MqttMessageDto | null {
    return this.recentMessages[0] ?? null;
  }
}
