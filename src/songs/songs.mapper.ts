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
      duration: SongMapper.parseDuration(createSongInput.duration),
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
        ? SongMapper.parseDuration(updateSongInput.duration)
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

  static parseDuration(durationString: string): Date {
    const durationParts = durationString.split(':');
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (durationParts.length === 3) {
      hours = parseInt(durationParts[0], 10);
      minutes = parseInt(durationParts[1], 10);
      seconds = parseInt(durationParts[2], 10);
    } else if (durationParts.length === 2) {
      minutes = parseInt(durationParts[0], 10);
      seconds = parseInt(durationParts[1], 10);
    } else {
      throw new Error('Formato de duración no válido');
    }

    const duration = new Date();
    duration.setHours(hours);
    duration.setMinutes(minutes);
    duration.setSeconds(seconds);

    return duration;
  }
}
