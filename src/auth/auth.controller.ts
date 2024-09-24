import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { LoginDTO } from './dto/login.dto';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { AuthService } from './auth.service';
import { EnableTwoFA } from './types/enable-two.fa.type';
import { AuthenticatedGaurd } from './guards/authenticated.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { KafkaProducerService } from 'src/kafka/producer/kafka.producer.service';
import { LoginSuccessDto } from './dto/login-success.dto';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(new TransformInterceptor(User))
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Register new user',
  })
  @ApiResponse({
    status: 201,
    description: 'It will return the user in the response',
  })
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.usersService.create(createUserDto);
      await this.kafkaProducer.sendMessage('user-signup-events', {
        userId: user.id,
        username: user.username,
        event: 'signup',
        status: 'success',
      });
      return user;
    } catch (e) {
      await this.kafkaProducer.sendMessage('user-signup-events', {
        username: createUserDto.username,
        event: 'signup',
        status: 'failed',
      });
      throw e;
    }
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body()
    loginDTO: LoginDTO,
  ) {
    try {
      const response = await this.authService.login(loginDTO);
      if ((response as LoginSuccessDto).accessToken) {
        console.log('calling kafka');
        await this.kafkaProducer.sendMessage('user-login-events', {
          username: loginDTO.username,
          event: 'login',
          status: 'success',
        });
      }
      console.log('returning response');
      return response;
    } catch (e) {
      await this.kafkaProducer.sendMessage('user-login-events', {
        username: loginDTO.username,
        event: 'login',
        status: 'failed',
      });
      throw e;
    }
  }

  @Post('enable2fa')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticatedGaurd)
  async enable2FA(
    @Request()
    req,
  ): Promise<EnableTwoFA> {
    return this.authService.enable2FA(req.user.userId);
  }

  @Post('validate2fa')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticatedGaurd)
  validate2FA(
    @Request()
    req,
    @Body()
    ValidateTokenDTO: ValidateTokenDTO,
  ): Promise<{ verified: boolean }> {
    return this.authService.validate2FAToken(
      req.user.userId,
      ValidateTokenDTO.token,
    );
  }

  @Post('disable2fa')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticatedGaurd)
  disable2FA(
    @Request()
    req,
  ): Promise<boolean> {
    return this.authService.disable2FA(req.user.userId);
  }
}
