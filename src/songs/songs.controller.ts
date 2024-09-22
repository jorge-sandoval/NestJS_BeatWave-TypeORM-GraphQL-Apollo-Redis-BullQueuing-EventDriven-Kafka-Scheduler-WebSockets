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
import { SongsService } from './songs.service';
import { Song } from '../entities/song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { PaginationResult } from '@common/interfaces/pagination-result.interface';
import { MAX_PAGE_SIZE } from '@common/constants/pagination';
import { ArtistGuard } from 'src/auth/guards/artist.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/decorators/user-id.decorator';

@Controller('songs')
@ApiTags('Songs')
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
  @ApiBearerAuth('JWT-auth')
  @UseGuards(ArtistGuard)
  async create(@Body() createSongDto: CreateSongDto): Promise<Song> {
    return this.songsService.create(createSongDto);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(ArtistGuard)
  async update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() updateSongDto: UpdateSongDto,
    @UserId() userId: number = null,
  ): Promise<Song> {
    console.log('userId from decorator: ', userId);

    if (Object.keys(updateSongDto).length === 0) {
      throw new BadRequestException(
        'At least one field must be provided to update',
      );
    }

    return this.songsService.update(id, updateSongDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(ArtistGuard)
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
