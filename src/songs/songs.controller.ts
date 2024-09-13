import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { Song } from '../entities/song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { PaginationResult } from '@common/interfaces/pagination-result.interface';
import { MAX_PAGE_SIZE } from '@common/constants/pagination';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  async getAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<PaginationResult<Song>> {
    if (pageSize > MAX_PAGE_SIZE) {
      throw new BadRequestException(
        `Page size cannot exceed ${MAX_PAGE_SIZE}. Requested: ${pageSize}`,
      );
    }

    return this.songsService.getAll(page, pageSize);
  }

  @Get(':id')
  async getById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Query('includeArtists') includeArtists?: boolean,
  ): Promise<Song> {
    return this.songsService.getById(id, includeArtists);
  }

  @Post()
  async create(@Body() createSongDto: CreateSongDto): Promise<Song> {
    return this.songsService.create(createSongDto);
  }

  @Patch(':id')
  async update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() updateSongDto: UpdateSongDto,
  ): Promise<Song> {
    if (Object.keys(updateSongDto).length === 0) {
      throw new BadRequestException(
        'At least one field must be provided to update',
      );
    }

    return this.songsService.update(id, updateSongDto);
  }

  @Delete(':id')
  async delete(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<void> {
    await this.songsService.delete(id);
  }
}
