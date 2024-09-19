import {
  LoginInput,
  LoginResponse,
  SignupInput,
  SignupResponse,
} from 'src/graphql';
import { LoginDTO } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginSuccessDto } from './dto/login-success.dto';
import { User } from '@entities/user.entity';

export class AuthMapper {
  static toLoginDTO(loginInput: LoginInput): LoginDTO {
    return {
      username: loginInput.username,
      password: loginInput.password,
    };
  }

  static toCreateUserDto(signupInput: SignupInput): CreateUserDto {
    return {
      firstName: signupInput.firstName,
      lastName: signupInput.lastName,
      username: signupInput.username,
      password: signupInput.password,
      apiKey: false,
    };
  }

  static toGraphQLLoginResponse(
    loginSuccessDto: LoginSuccessDto,
  ): LoginResponse {
    return {
      accessToken: loginSuccessDto.accessToken,
    };
  }

  static toGraphQLSignupResponse(user: User): SignupResponse {
    return {
      username: user.username,
    };
  }
}
