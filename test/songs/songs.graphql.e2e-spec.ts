import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceTest } from 'src/db/data-source';
import { SeedsService } from 'src/seeds/seeds.service';
import * as request from 'supertest';
import { SeedsModule } from 'src/seeds/seeds.module';
import { SongsModule } from 'src/songs/songs.module';
import { AuthModule } from 'src/auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

describe('Songs Resolver - GraphQL', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        TypeOrmModule.forRoot(dataSourceTest.options),
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          typePaths: ['./**/*.graphql'],
          definitions: {
            path: join(process.cwd(), 'src/graphql.ts'),
            outputAs: 'class',
          },
          context: ({ req }) => ({ req }),
          installSubscriptionHandlers: true,
        }),
        SeedsModule,
        SongsModule,
        AuthModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const seeder = moduleRef.get(SeedsService);
    await seeder.seed();

    const query = `
    query {
      login(loginInput: { username: "artist", password: "p4ssw0d!" }) {
        accessToken
      }
    }
  `;

    const loginResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(HttpStatus.OK);

    jwtToken = loginResponse.body.data.login.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Get All songs)', () => {
    it('should return paginated songs', async () => {
      const query = `
        query {
          songs(page: 1, pageSize: 10) {
            id
            title
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(HttpStatus.OK);

      expect(response.body.data.songs).toBeDefined();
      expect(Array.isArray(response.body.data.songs)).toBe(true);
    });

    it('should handle empty results', async () => {
      const query = `
        query {
          songs(page: 999, pageSize: 10) {
            id
            title
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(HttpStatus.OK);

      expect(response.body.data.songs).toEqual([]);
    });
  });

  describe('Get song', () => {
    it('should return a song by id with status 200', async () => {
      const songId = 1;

      const query = `
        query {
          song(id: ${songId}) {
            id
            title
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(HttpStatus.OK);

      expect(response.body.data.song).toHaveProperty('id', songId.toString());
      expect(response.body.data.song).toHaveProperty('title');
    });

    it('should return 404 if song not found', async () => {
      const songId = 999999;

      const query = `
        query {
          song(id: ${songId}) {
            id
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query });

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        'Song with ID 999999 not found',
      );
    });
  });

  describe('Create song', () => {
    it('should create a new song', async () => {
      const query = `
        mutation {
          createSong(createSongInput: { title: "New Song", duration: "03:52", releasedDate: "2024-05-03", artistIds: ["1"] }) {
            id
            title
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ query })
        .expect(HttpStatus.OK);

      expect(response.body.data.createSong).toBeDefined();
      expect(response.body.data.createSong.title).toBe('New Song');
    });
  });

  describe('Update Song', () => {
    it('should update a song', async () => {
      const existingSongId = 1;

      const query = `
        mutation {
          updateSong(id: ${existingSongId}, updateSongInput: { title: "Updated Song Title" }) {
            id
            title
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ query })
        .expect(HttpStatus.OK);

      expect(response.body.data.updateSong).toBeDefined();
      expect(response.body.data.updateSong.title).toBe('Updated Song Title');
    });

    it('should return error if the song does not exist', async () => {
      const nonExistentSongId = 999;

      const query = `
        mutation {
          updateSong(id: ${nonExistentSongId}, updateSongInput: { title: "Non-Existent Song" }) {
            id
            title
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ query });

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toContain(
        `Song with ID ${nonExistentSongId} not found`,
      );
    });
  });
});
