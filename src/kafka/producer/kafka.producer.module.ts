import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerService } from './kafka.producer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE_PRODUCER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'my-producer-client',
            brokers: ['localhost:9093'],
          },
          producer: {
            allowAutoTopicCreation: true,
          },
          producerOnlyMode: true,
        },
      },
    ]),
  ],
  providers: [KafkaProducerService],
  exports: [KafkaProducerService],
})
export class KafkaProducerModule {}
