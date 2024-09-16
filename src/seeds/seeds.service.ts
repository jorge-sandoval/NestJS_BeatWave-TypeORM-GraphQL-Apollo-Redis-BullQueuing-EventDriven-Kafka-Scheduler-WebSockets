import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { faker } from '@faker-js/faker';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedsService {
  constructor(private readonly usersService: UsersService) {}

  async seed() {
    const response = await this.usersService.getAll(1, 1);

    if (response.totalItems === 0) {
      const user = await this.user();
      await this.usersService.create(user);
    }
  }

  private async user() {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash('p4ssw0d!', salt);

    const user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: faker.internet.userName(),
      password,
      apiKey: false,
    };

    return user as CreateUserDto;
  }
}
