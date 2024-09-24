import { Module } from '@nestjs/common';
import { KafkaConsumerModule } from './consumer/kafka.consumer.module';
import { KafkaProducerModule } from './producer/kafka.producer.module';

@Module({
  imports: [KafkaConsumerModule, KafkaProducerModule],
  exports: [KafkaConsumerModule, KafkaProducerModule],
})
export class KafkaModule {}
