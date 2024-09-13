import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Query,
  HttpStatus,
  ParseIntPipe,
  BadRequestException,
  Patch,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationResult } from '@common/interfaces/pagination-result.interface';
import { MAX_PAGE_SIZE } from '@common/constants/pagination';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { AuthenticatedGaurd } from 'src/auth/guards/authenticated.guard';

@Controller('users')
@UseInterceptors(new TransformInterceptor(User))
@UseGuards(AuthenticatedGaurd)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<PaginationResult<User>> {
    if (pageSize > MAX_PAGE_SIZE) {
      throw new BadRequestException(
        `Page size cannot exceed ${MAX_PAGE_SIZE}. Requested: ${pageSize}`,
      );
    }

    return this.usersService.getAll(page, pageSize);
  }

  @Get(':id')
  async getById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Query('includePlaylists') includePlaylists?: boolean,
  ): Promise<User> {
    return this.usersService.getById(id, includePlaylists);
  }

  @Patch(':id')
  async update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async delete(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<void> {
    await this.usersService.delete(id);
  }
}
