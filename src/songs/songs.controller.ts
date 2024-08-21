import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { Song } from '../entities/song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  async getAll(): Promise<Song[]> {
    try {
      return this.songsService.getAll();
    } catch (e) {
      throw new HttpException(
        'server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Song> {
    const songId = parseInt(id, 10);
    const song = await this.songsService.getById(songId);
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
    return song;
  }

  @Post()
  async create(@Body() createSongDto: CreateSongDto): Promise<Song> {
    return this.songsService.create(createSongDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSongDto: UpdateSongDto,
  ): Promise<Song> {
    const songId = parseInt(id, 10);
    const song = await this.songsService.update(songId, updateSongDto);
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
    return song;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    const songId = parseInt(id, 10);
    const deleted = await this.songsService.delete(songId);
    if (!deleted) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
  }
}
