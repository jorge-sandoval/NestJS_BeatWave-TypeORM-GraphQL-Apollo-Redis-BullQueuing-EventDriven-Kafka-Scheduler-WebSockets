import {
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticatedGaurd } from './auth/guards/authenticated.guard';
import { ApiKeyGuard } from './auth/guards/api-key.guard';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { User } from '@entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { KafkaProducerService } from './kafka/producer/kafka.producer.service';

@Controller()
@ApiTags('Demo')
@UseInterceptors(new TransformInterceptor(User))
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  @Get('hello')
  async getHello(): Promise<string> {
    await this.kafkaProducer.sendMessage('user-login-events', {
      username: 'testUser',
      event: 'login',
      status: 'success',
    });

    return this.appService.getHello();
  }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticatedGaurd)
  getProfile(@Req() request) {
    return request.user;
  }

  @Get('apiprofile')
  @ApiBearerAuth('API-Key-auth')
  @UseGuards(ApiKeyGuard)
  getProfileWithApiKey(
    @Req()
    request,
  ) {
    return request.user;
  }
}
