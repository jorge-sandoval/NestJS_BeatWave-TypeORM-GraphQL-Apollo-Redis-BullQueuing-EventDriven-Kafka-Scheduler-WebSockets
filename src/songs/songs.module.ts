import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from 'src/entities/song.entity';
import { Artist } from '@entities/artist.entity';
import { SongsResolver } from './songs.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist])],
  controllers: [SongsController],
  providers: [SongsService, SongsResolver],
})
export class SongsModule {}
