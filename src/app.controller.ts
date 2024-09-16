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
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Demo')
@UseInterceptors(new TransformInterceptor(User))
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('profile')
  @UseGuards(AuthenticatedGaurd)
  getProfile(@Req() request) {
    return request.user;
  }

  @Get('apiprofile')
  @UseGuards(ApiKeyGuard)
  getProfileWithApiKey(
    @Req()
    request,
  ) {
    return request.user;
  }
}
