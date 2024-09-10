import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Playlist } from 'src/entities/playlist.entity';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/entities/song.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { PaginationResult } from '@common/interfaces/pagination-result.interface';

@Injectable({
  scope: Scope.DEFAULT, // Scope.TRANSIENT, Scope.REQUEST, Scope.DEFAULT (Singleton)
})
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistsRepository: Repository<Playlist>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Song)
    private readonly songsRepository: Repository<Song>,
  ) {}

  async getAll(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginationResult<Playlist>> {
    const [playlists, total] = await this.playlistsRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['songs', 'user'],
    });

    const totalPages = Math.ceil(total / pageSize);
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    return {
      items: playlists,
      totalItems: total,
      currentPage: page,
      pageSize,
      totalPages,
      prevPage,
      nextPage,
    };
  }

  async getById(id: number): Promise<Playlist> {
    const playlist = await this.playlistsRepository.findOne({
      where: { id },
      relations: ['songs', 'user'],
    });

    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }

    return playlist;
  }

  async create(createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
    const songs = await this.songsRepository.find({
      where: { id: In(createPlaylistDto.songIds) },
    });

    const user = await this.usersRepository.findOne({
      where: { id: createPlaylistDto.userId },
    });

    const playlist = new Playlist();
    playlist.name = createPlaylistDto.name;
    playlist.songs = songs;
    playlist.user = user;

    return this.playlistsRepository.save(playlist);
  }

  async update(
    id: number,
    updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Playlist> {
    const playlist = await this.playlistsRepository.findOne({
      where: { id },
      relations: ['songs', 'user'],
    });

    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }

    playlist.name = updatePlaylistDto.name ?? playlist.name;

    if (updatePlaylistDto.songIds) {
      const songs = await this.songsRepository.find({
        where: { id: In(updatePlaylistDto.songIds) },
      });
      playlist.songs = songs;
    }

    if (updatePlaylistDto.userId) {
      const user = await this.usersRepository.findOne({
        where: { id: updatePlaylistDto.userId },
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${updatePlaylistDto.userId} not found`,
        );
      }
      playlist.user = user;
    }

    return this.playlistsRepository.save(playlist);
  }

  async delete(id: number): Promise<void> {
    const playlist = await this.playlistsRepository.findOne({
      where: { id },
    });

    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }

    await this.playlistsRepository.remove(playlist);
  }
}
