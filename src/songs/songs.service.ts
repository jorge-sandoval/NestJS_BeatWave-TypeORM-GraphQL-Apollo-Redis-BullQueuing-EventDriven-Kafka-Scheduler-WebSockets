import { Injectable, NotFoundException } from '@nestjs/common';
import { Song } from 'src/entities/song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PaginationResult } from '@common/interfaces/pagination-result.interface';
import { Artist } from '@entities/artist.entity';

@Injectable()
export class SongsService {
  private readonly songs: Song[] = [];

  constructor(
    @InjectRepository(Song)
    private readonly songsRepository: Repository<Song>,
    @InjectRepository(Artist)
    private readonly artistsRepository: Repository<Artist>,
  ) {}

  async getAll(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginationResult<Song>> {
    const [songs, total] = await this.songsRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    return {
      items: songs,
      totalItems: total,
      currentPage: page,
      pageSize,
      totalPages,
      prevPage,
      nextPage,
    };
  }

  async getById(id: number, includeArtists: boolean = false): Promise<Song> {
    const song = await this.songsRepository.findOne({
      where: { id },
      relations: includeArtists ? ['artists'] : [],
    });

    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }

    return song;
  }

  async create(createSongDto: CreateSongDto): Promise<Song> {
    const song = new Song();
    song.title = createSongDto.title;
    song.duration = createSongDto.duration;
    song.releasedDate = createSongDto.releaseDate;

    if (createSongDto.artistIds) {
      const playlists = await this.artistsRepository.find({
        where: { id: In(createSongDto.artistIds) },
      });
      song.artists = playlists;
    }

    return this.songsRepository.save(song);
  }

  async update(id: number, updateSongDto: UpdateSongDto): Promise<Song | null> {
    const song = await this.songsRepository.findOne({
      where: { id },
      relations: updateSongDto.artistIds?.length > 0 ? ['artists'] : [],
    });

    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }

    song.title = updateSongDto.title ?? song.title;
    song.duration = updateSongDto.duration ?? song.duration;
    song.releasedDate = updateSongDto.releaseDate ?? song.releasedDate;

    if (updateSongDto.artistIds) {
      const playlists = await this.artistsRepository.find({
        where: { id: In(updateSongDto.artistIds) },
      });
      song.artists = playlists;
    }

    return await this.songsRepository.save(song);
  }

  async delete(id: number): Promise<void> {
    const song = await this.songsRepository.findOne({
      where: { id },
    });

    if (!song) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.songsRepository.remove(song);
  }
}
