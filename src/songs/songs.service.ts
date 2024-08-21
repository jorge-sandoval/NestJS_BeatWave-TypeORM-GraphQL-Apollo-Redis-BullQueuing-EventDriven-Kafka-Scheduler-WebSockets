import { Injectable } from '@nestjs/common';
import { Song } from 'src/entities/song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationResult } from '@common/interfaces/pagination-result.interface';

@Injectable()
export class SongsService {
  private readonly songs: Song[] = [];

  constructor(
    @InjectRepository(Song)
    private readonly songsRepository: Repository<Song>,
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

  async getById(id: number): Promise<Song> {
    const song = await this.songsRepository.findOne({ where: { id } });
    return song;
  }

  async create(createSongDto: CreateSongDto): Promise<Song> {
    const song = this.songsRepository.create(createSongDto);
    return await this.songsRepository.save(song);
  }

  async update(id: number, updateSongDto: UpdateSongDto): Promise<Song | null> {
    const song = await this.songsRepository.findOne({ where: { id } });
    if (!song) {
      return null;
    }

    Object.assign(song, updateSongDto);

    return await this.songsRepository.save(song);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.songsRepository.delete(id);
    return result.affected > 0;
  }
}
