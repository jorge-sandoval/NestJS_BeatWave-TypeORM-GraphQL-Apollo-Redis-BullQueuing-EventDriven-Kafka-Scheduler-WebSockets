import {
  CreateSongInput,
  UpdateSongInput,
  Song as GraphQLSong,
} from 'src/graphql';
import { Song as EntitySong } from '@entities/song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

export class SongMapper {
  static toCreateSongDto(createSongInput: CreateSongInput): CreateSongDto {
    return {
      title: createSongInput.title,
      artistIds: createSongInput.artistIds.map((id) => parseInt(id, 10)),
      releasedDate: new Date(createSongInput.releasedDate),
      duration: new Date(createSongInput.duration),
    };
  }

  static toUpdateSongDto(updateSongInput: UpdateSongInput): UpdateSongDto {
    return {
      title: updateSongInput.title,
      artistIds: updateSongInput.artistIds?.map((id) => parseInt(id, 10)),
      releasedDate: updateSongInput.releasedDate
        ? new Date(updateSongInput.releasedDate)
        : undefined,
      duration: updateSongInput.duration
        ? new Date(updateSongInput.duration)
        : undefined,
    };
  }

  static toGraphQLSong(song: EntitySong): GraphQLSong {
    return {
      id: song.id.toString(),
      title: song.title,
      releaseDate:
        typeof song.releasedDate === 'string'
          ? song.releasedDate
          : song.releasedDate.toISOString(),
      duration:
        typeof song.duration === 'string'
          ? song.duration
          : song.duration.toISOString(),
    };
  }

  static fromGraphQLSong(graphqlSong: GraphQLSong): EntitySong {
    const song = new EntitySong();
    song.id = parseInt(graphqlSong.id, 10);
    song.title = graphqlSong.title || '';
    song.releasedDate = new Date(graphqlSong.releaseDate);
    song.duration = new Date(graphqlSong.duration);
    return song;
  }
}
