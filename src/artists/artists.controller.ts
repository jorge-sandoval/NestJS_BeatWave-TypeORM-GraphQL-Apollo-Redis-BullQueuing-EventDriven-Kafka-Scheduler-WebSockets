import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpStatus,
  ParseIntPipe,
  BadRequestException,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { Artist } from '@entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist';
import { UpdateArtistDto } from './dto/update-artist';
import { AuthenticatedGaurd } from 'src/auth/guards/authenticated.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('artists')
@ApiTags('Artists')
export class ArtistsController {
  constructor(private readonly artistService: ArtistsService) {}

  @Get(':id')
  async getById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<Artist> {
    return this.artistService.getById(id);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticatedGaurd)
  async create(@Body() createArtistDto: CreateArtistDto): Promise<Artist> {
    return this.artistService.create(createArtistDto);
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
    @Body() updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    if (Object.keys(updateArtistDto).length === 0) {
      throw new BadRequestException(
        'At least one field must be provided to update',
      );
    }

    return this.artistService.update(id, updateArtistDto);
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
    await this.artistService.delete(id);
  }
}
