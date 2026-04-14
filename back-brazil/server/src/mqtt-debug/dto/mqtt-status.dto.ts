export class MqttStatusDto {
  connected!: boolean;
  brokerUrl!: string;
  topic!: string;
  clientId!: string;
  receivedMessagesCount!: number;
  lastMessageAt!: string | null;
}
