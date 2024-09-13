import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Playlist } from './playlist.entity';
import { Artist } from './artist.entity';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('date')
  releasedDate: Date;

  @Column('time')
  duration: Date;

  @ManyToMany(() => Artist, (artist) => artist.songs)
  @JoinTable({ name: 'songs_artists' })
  artists: Artist[];

  @ManyToMany(() => Playlist, (playlist) => playlist.songs)
  playlists: Playlist[];
}
