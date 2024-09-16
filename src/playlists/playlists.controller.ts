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
  UseGuards,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { Playlist } from 'src/entities/playlist.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PaginationResult } from '@common/interfaces/pagination-result.interface';
import { MAX_PAGE_SIZE } from '@common/constants/pagination';
import { AuthenticatedGaurd } from 'src/auth/guards/authenticated.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('playlists')
@ApiTags('Playlists')
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
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticatedGaurd)
  async create(@Body() createSongDto: CreatePlaylistDto): Promise<Playlist> {
    return this.playlistsService.create(createSongDto);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticatedGaurd)
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
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticatedGaurd)
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
