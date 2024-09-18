import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateSongInput,
  Song as GraphQLSong,
  UpdateSongInput,
} from 'src/graphql';
import { SongsService } from './songs.service';
import { SongMapper } from './songs.mapper';

@Resolver(() => GraphQLSong)
export class SongsResolver {
  constructor(private songService: SongsService) {}

  @Query(() => [GraphQLSong])
  async songs(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('pageSize', { type: () => Int, defaultValue: 10 }) pageSize: number,
  ): Promise<GraphQLSong[]> {
    const songs = await this.songService.getAll(page, pageSize);
    return songs.items.map(SongMapper.toGraphQLSong);
  }

  @Query(() => GraphQLSong)
  async song(@Args('id') id: string): Promise<GraphQLSong> {
    const song = await this.songService.getById(Number(id));
    return SongMapper.toGraphQLSong(song);
  }

  @Mutation(() => GraphQLSong)
  async createSong(
    @Args('createSongInput') createSongInput: CreateSongInput,
  ): Promise<GraphQLSong> {
    const createSongDto = SongMapper.toCreateSongDto(createSongInput);
    const song = await this.songService.create(createSongDto);
    return SongMapper.toGraphQLSong(song);
  }

  @Mutation(() => GraphQLSong)
  async updateSong(
    @Args('id') id: string,
    @Args('updateSongInput') updateSongInput: UpdateSongInput,
  ): Promise<GraphQLSong> {
    const updateSongDto = SongMapper.toUpdateSongDto(updateSongInput);
    const updatedSong = await this.songService.update(
      Number(id),
      updateSongDto,
    );
    return SongMapper.toGraphQLSong(updatedSong);
  }

  @Mutation(() => Boolean)
  async deleteSong(@Args('id') id: string): Promise<boolean> {
    await this.songService.delete(Number(id));
    return true;
  }
}
