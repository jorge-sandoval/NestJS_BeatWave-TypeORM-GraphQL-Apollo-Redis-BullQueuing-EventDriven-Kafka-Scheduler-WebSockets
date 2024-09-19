import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import {
  LoginInput,
  LoginResponse,
  SignupInput,
  SignupResponse,
} from 'src/graphql';
import { AuthMapper } from './auth.mapper';
import { LoginSuccessDto } from './dto/login-success.dto';

@Resolver()
export class AuthResolver {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Query(() => LoginResponse)
  async login(
    @Args('loginInput')
    loginInput: LoginInput,
  ): Promise<LoginResponse> {
    const loginDto = AuthMapper.toLoginDTO(loginInput);

    const response = (await this.authService.login(
      loginDto,
    )) as LoginSuccessDto;

    return AuthMapper.toGraphQLLoginResponse(response);
  }

  @Mutation(() => SignupResponse)
  async signup(
    @Args('signupInput')
    signupInput: SignupInput,
  ): Promise<SignupResponse> {
    const createUserDto = AuthMapper.toCreateUserDto(signupInput);

    const response = await this.userService.create(createUserDto);

    return AuthMapper.toGraphQLSignupResponse(response);
  }
}
