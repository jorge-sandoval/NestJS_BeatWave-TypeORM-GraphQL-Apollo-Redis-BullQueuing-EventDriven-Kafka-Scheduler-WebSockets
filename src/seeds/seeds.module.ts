import { Module } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { UsersModule } from 'src/users/users.module';
import { ArtistsModule } from 'src/artists/artists.module';
import { SongsModule } from 'src/songs/songs.module';

@Module({
  imports: [UsersModule, ArtistsModule, SongsModule],
  providers: [SeedsService],
  exports: [SeedsService],
})
export class SeedsModule {}
