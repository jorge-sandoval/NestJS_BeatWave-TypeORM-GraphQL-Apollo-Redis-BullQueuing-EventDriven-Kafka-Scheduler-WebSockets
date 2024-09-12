import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';

@Controller('auth')
@UseInterceptors(new TransformInterceptor(User))
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}
