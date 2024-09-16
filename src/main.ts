import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedsService } from './seeds/seeds.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const seeder = app.get(SeedsService);
  await seeder.seed();

  await app.listen(3000);
}
bootstrap();
