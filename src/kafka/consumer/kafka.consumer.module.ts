import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaConsumerService } from './kafka.consumer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE_CONSUMER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'my-consumer-client',
            brokers: ['localhost:9093'],
            logLevel: 4,
          },
          consumer: {
            groupId: '',
            allowAutoTopicCreation: true,
          },
          subscribe: {
            fromBeginning: true,
          },
        },
      },
    ]),
  ],
  providers: [KafkaConsumerService],
  exports: [KafkaConsumerService],
})
export class KafkaConsumerModule {}
