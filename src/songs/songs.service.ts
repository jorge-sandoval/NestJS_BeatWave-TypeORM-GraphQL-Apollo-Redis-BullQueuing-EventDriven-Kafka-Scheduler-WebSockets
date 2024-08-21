import { Injectable } from '@nestjs/common';
import { Song } from 'src/entities/song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable()
export class SongsService {
  private readonly songs: Song[] = [];

  getAll(): Song[] {
    return this.songs;
  }

  getById(id: number): Song {
    return this.songs.find((song) => song.id === id);
  }

  create(createSongDto: CreateSongDto): Song {
    const newSong: Song = {
      id: Date.now(),
      ...createSongDto,
    };
    this.songs.push(newSong);
    return newSong;
  }

  update(id: number, updateSongDto: UpdateSongDto): Song {
    const songIndex = this.songs.findIndex((song) => song.id === id);
    if (songIndex === -1) return null;
    this.songs[songIndex] = { ...this.songs[songIndex], ...updateSongDto };
    return this.songs[songIndex];
  }

  delete(id: number): boolean {
    const songIndex = this.songs.findIndex((song) => song.id === id);
    if (songIndex === -1) return false;
    this.songs.splice(songIndex, 1);
    return true;
  }
}
