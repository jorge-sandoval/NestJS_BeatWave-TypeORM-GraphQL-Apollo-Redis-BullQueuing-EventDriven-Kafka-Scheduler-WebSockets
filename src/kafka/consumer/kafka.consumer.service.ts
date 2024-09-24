import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE_CONSUMER') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('user-login-events');
    await this.kafkaClient.connect();
    console.log('Kafka Consumer Service Initialized');
  }

  @EventPattern('user-login-events')
  handleLoginEvent(@Payload() message: any) {
    console.log('Login Event Received:');
    console.log('Login Event Received:', JSON.stringify(message));
  }

  @EventPattern('user-signup-events')
  handleSignupEvent(@Payload() message: any) {
    console.log('Signup Event Received:', message);
  }
}
