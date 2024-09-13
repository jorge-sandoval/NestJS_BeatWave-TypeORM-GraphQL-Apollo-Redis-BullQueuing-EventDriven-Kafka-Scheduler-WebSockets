import { Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from 'src/entities/artist.entity';
import { User } from '@entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, User])],
  providers: [ArtistsService],
  controllers: [ArtistsController],
  exports: [ArtistsService],
})
export class ArtistsModule {}
