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

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private artistsService: ArtistsService,
  ) {}

  async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
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
}
