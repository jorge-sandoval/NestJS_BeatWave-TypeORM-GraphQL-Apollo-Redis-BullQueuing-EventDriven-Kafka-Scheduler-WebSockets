import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Playlist } from './playlist.entity';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('simple-array')
  artists: string[];

  @Column()
  releaseDate: string;

  @Column()
  duration: string;

  @ManyToMany(() => Playlist, (playlist) => playlist.songs)
  playlists: Playlist[];
}
