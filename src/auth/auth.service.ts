import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ArtistsService } from 'src/artists/artists.service';
import * as speakeasy from 'speakeasy';
import { EnableTwoFA } from './types/enable-two.fa.type';
import { User } from '@entities/user.entity';
import { LoginSuccessDto } from './dto/login-success.dto';
import { Login2FADto } from './dto/login-2fa.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private artistsService: ArtistsService,
  ) {}

  async login(loginDTO: LoginDTO): Promise<LoginSuccessDto | Login2FADto> {
    const user = await this.userService.getByUsername(loginDTO.username);

    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (passwordMatched) {
      const payload = {
        username: user.username,
        sub: user.id,
        artistId: undefined,
      };

      try {
        const artist = await this.artistsService.getByUserId(user.id);

        if (artist) {
          payload.artistId = artist.id;
        }

        if (user.enableTwoFA && user.twoFASecret) {
          return {
            validate2FA: 'http://localhost:3000/auth/validate-2fa',
            message:
              'Please sends the one time password/token from your Google Authenticator App',
          };
        }
      } catch (e) {
        if (!(e instanceof NotFoundException)) throw e;
      }

      return {
        accessToken: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Password does not match');
    }
  }

  async enable2FA(userId: number): Promise<EnableTwoFA> {
    const user = await this.userService.getById(userId);
    if (user.enableTwoFA) {
      return { secret: user.twoFASecret };
    }

    const secret = speakeasy.generateSecret().base32;
    await this.userService.enable2FA(user.id, secret);

    return { secret };
  }

  async disable2FA(userId: number): Promise<boolean> {
    const user = await this.userService.getById(userId);
    const result = await this.userService.disable2FA(user.id);
    return result.affected > 0;
  }

  async validate2FAToken(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    const user = await this.userService.getById(userId);
    try {
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token: token,
        encoding: 'base32',
      });

      if (verified) {
        return { verified: true };
      } else {
        return { verified: false };
      }
    } catch {
      throw new UnauthorizedException('Error verifying token');
    }
  }

  async validateUserByApiKey(apiKey: string): Promise<User> {
    return this.userService.getByApiKey(apiKey);
  }
}
