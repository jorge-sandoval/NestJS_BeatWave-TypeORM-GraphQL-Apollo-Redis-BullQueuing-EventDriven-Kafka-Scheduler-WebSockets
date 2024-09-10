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
import { PlaylistsService } from './playlists.service';
import { Playlist } from 'src/entities/playlist.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PaginationResult } from '@common/interfaces/pagination-result.interface';
import { MAX_PAGE_SIZE } from '@common/constants/pagination';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Get()
  async getAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<PaginationResult<Playlist>> {
    if (pageSize > MAX_PAGE_SIZE) {
      throw new BadRequestException(
        `Page size cannot exceed ${MAX_PAGE_SIZE}. Requested: ${pageSize}`,
      );
    }

    return this.playlistsService.getAll(page, pageSize);
  }

  @Get(':id')
  async getById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<Playlist> {
    return this.playlistsService.getById(id);
  }

  @Post()
  async create(@Body() createSongDto: CreatePlaylistDto): Promise<Playlist> {
    return this.playlistsService.create(createSongDto);
  }

  @Patch(':id')
  async update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Playlist> {
    return this.playlistsService.update(id, updatePlaylistDto);
  }

  @Delete(':id')
  async delete(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<void> {
    await this.playlistsService.delete(id);
  }
}
