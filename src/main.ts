import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SeedsService } from './seeds/seeds.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const seeder = app.get(SeedsService);
  await seeder.seed();

  setupSwagger(app);

  await app.listen(3000);

  setUpHotReload(app);
}

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('BeatWave')
    .setDescription('Modern music streaming platform')
    .setVersion('1.0')
    .addBearerAuth(
      {
        name: 'JWT',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        description: 'Enter JWT token',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        name: 'API-Key',
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        description: 'Enter API Key',
      },
      'API-Key-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

function setUpHotReload(app: INestApplication) {
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
