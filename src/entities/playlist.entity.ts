import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Song } from './song.entity';
import { User } from './user.entity';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Song, (song) => song.playlists)
  @JoinTable()
  songs: Song[];

  @ManyToOne(() => User, (user) => user.playlists)
  user: User;
}
