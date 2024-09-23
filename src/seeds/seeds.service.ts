import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { faker } from '@faker-js/faker';
import { ArtistsService } from 'src/artists/artists.service';
import { SongsService } from 'src/songs/songs.service';

@Injectable()
export class SeedsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly artistsService: ArtistsService,
    private readonly songsService: SongsService,
  ) {}

  async seed() {
    const response = await this.usersService.getAll(1, 1);

    if (response.totalItems === 0) {
      await this.user('admin');

      const artist = await this.artist('artist');
      await this.song([artist.id]);
    }
  }

  private async user(username: string) {
    const user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username,
      password: 'p4ssw0d!',
      apiKey: false,
    };

    return await this.usersService.create(user);
  }

  private async artist(username: string) {
    const user = await this.user(username);
    return await this.artistsService.create({
      stageName: faker.music.artist(),
      userId: user.id,
    });
  }

  private async song(artistIds: number[]) {
    return await this.songsService.create({
      title: faker.music.songName(),
      artistIds,
      releasedDate: faker.date.past(),
      duration: faker.date.recent(),
    });
  }
}
