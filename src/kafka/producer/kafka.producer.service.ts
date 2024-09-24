import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE_PRODUCER')
    private readonly clientKafka: ClientKafka,
  ) {}

  async sendMessage(topic: string, message: any) {
    console.log(`Sending message to topic ${topic}:`, message);
    try {
      const response = await this.clientKafka.emit(topic, message);
      console.log('Response from Kafka:', response);
    } catch (error) {
      console.error('Error sending message to Kafka:', error);
    }
  }

  async onModuleInit() {
    await this.clientKafka.connect();
    console.log('Kafka Producer connected to broker');
  }
}
