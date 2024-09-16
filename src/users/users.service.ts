import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, UpdateResult } from 'typeorm';
import { Playlist } from 'src/entities/playlist.entity';
import { PaginationResult } from '@common/interfaces/pagination-result.interface';
import { v4 as uuid4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Playlist)
    private readonly playlistsRepository: Repository<Playlist>,
  ) {}

  async getAll(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginationResult<User>> {
    const [users, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    return {
      items: users,
      totalItems: total,
      currentPage: page,
      pageSize,
      totalPages,
      prevPage,
      nextPage,
    };
  }

  async getById(id: number, includePlaylists: boolean = false): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: includePlaylists ? ['playlists'] : [],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async getByUsername(
    username: string,
    includePlaylists: boolean = false,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: includePlaylists ? ['playlists'] : [],
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  async getByApiKey(apiKey: string): Promise<User> {
    return this.usersRepository.findOneBy({ apiKey });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.username = createUserDto.username;

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(createUserDto.password, salt);
    user.apiKey = createUserDto.apiKey === true ? uuid4() : null;

    return this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: updateUserDto.playlistsIds?.length > 0 ? ['playlists'] : [],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.firstName = updateUserDto.firstName ?? user.firstName;
    user.lastName = updateUserDto.lastName ?? user.lastName;
    user.username = updateUserDto.username ?? user.username;
    user.password = updateUserDto.password ?? user.password;

    if (updateUserDto.playlistsIds) {
      const playlists = await this.playlistsRepository.find({
        where: { id: In(updateUserDto.playlistsIds) },
      });
      user.playlists = playlists;
    }

    return this.usersRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await this.usersRepository.remove(user);
    } catch (error) {
      if (error.message?.includes('FK_')) {
        throw new ConflictException(
          `Cannot delete user with ID ${id} because of foreing key reference.`,
        );
      }
      throw error;
    }
  }

  async enable2FA(userId, secret: string): Promise<UpdateResult> {
    return this.usersRepository.update(
      { id: userId },
      {
        twoFASecret: secret,
        enableTwoFA: true,
      },
    );
  }
  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.usersRepository.update(
      { id: userId },
      {
        enableTwoFA: false,
        twoFASecret: null,
      },
    );
  }
}
