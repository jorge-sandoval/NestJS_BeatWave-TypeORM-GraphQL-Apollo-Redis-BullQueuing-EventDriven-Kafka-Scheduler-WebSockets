import {
  Body,
  Controller,
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

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(new TransformInterceptor(User))
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
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
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(
    @Body()
    loginDTO: LoginDTO,
  ) {
    return this.authService.login(loginDTO);
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
