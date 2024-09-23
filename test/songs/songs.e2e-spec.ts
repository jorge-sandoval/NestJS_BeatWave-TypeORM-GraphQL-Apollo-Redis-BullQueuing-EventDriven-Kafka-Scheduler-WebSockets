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
import { CreateSongDto } from 'src/songs/dto/create-song.dto';
import { faker } from '@faker-js/faker';
import { UpdateSongDto } from 'src/songs/dto/update-song.dto';

describe('Songs - /songs', () => {
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
        SeedsModule,
        SongsModule,
        AuthModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const seeder = moduleRef.get(SeedsService);
    await seeder.seed();

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'artist', password: 'p4ssw0d!' })
      .expect(HttpStatus.OK);

    jwtToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /songs', () => {
    it('should return paginated songs', async () => {
      const response = await request(app.getHttpServer())
        .get('/songs?page=1&pageSize=10')
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('totalItems');
      expect(response.body).toHaveProperty('currentPage', 1);
      expect(response.body).toHaveProperty('pageSize', 10);
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body).toHaveProperty('prevPage');
      expect(response.body).toHaveProperty('nextPage');
    });

    it('should throw BadRequestException for invalid page size', async () => {
      const response = await request(app.getHttpServer())
        .get('/songs?page=1&pageSize=101')
        .expect(400);

      expect(response.body.message).toContain('Page size cannot exceed');
    });
  });

  describe('GET /songs', () => {
    it('should return a song by id with status 200', async () => {
      const songId = 1;

      const response = await request(app.getHttpServer())
        .get(`/songs/${songId}`)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('id', songId);
      expect(response.body).toHaveProperty('title');
      expect(response.body).not.toHaveProperty('artists');
    });

    it('should return 406 if id is not a number', async () => {
      const response = await request(app.getHttpServer())
        .get('/songs/not-a-number')
        .expect(HttpStatus.NOT_ACCEPTABLE);

      expect(response.body.message).toContain('Validation failed');
    });

    it('should handle the includeArtists query parameter', async () => {
      const songId = 1;

      const response = await request(app.getHttpServer())
        .get(`/songs/${songId}?includeArtists=true`)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('id', songId);
      expect(response.body).toHaveProperty('artists');
    });
  });

  describe('Songs - /songs (POST)', () => {
    const createSongDto: CreateSongDto = {
      title: 'New Song',
      duration: faker.date.anytime(),
      releasedDate: faker.date.recent(),
      artistIds: [1],
    };

    it('should create a song with status 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/songs')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(createSongDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'New Song');
    });

    it('should return 401 if no token is provided', async () => {
      await request(app.getHttpServer())
        .post('/songs')
        .send(createSongDto)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('Songs - /songs (PATCH)', () => {
    it('should update a song with valid data and return status 200', async () => {
      const updateSongDto: UpdateSongDto = {
        title: 'Updated Song Title',
      };

      const updateResponse = await request(app.getHttpServer())
        .patch(`/songs/1`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updateSongDto)
        .expect(HttpStatus.OK);

      expect(updateResponse.body).toHaveProperty('id', 1);
      expect(updateResponse.body).toHaveProperty('title', 'Updated Song Title');
    });

    it('should return 406 if id is not a number', async () => {
      const response = await request(app.getHttpServer())
        .patch('/songs/not-a-number')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(HttpStatus.NOT_ACCEPTABLE);

      expect(response.body.message).toContain('Validation failed');
    });

    it('should return 400 when no fields are provided for update', async () => {
      await request(app.getHttpServer())
        .patch(`/songs/1`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('Songs - /songs (DELETE)', () => {
    it('should delete a song and return status 200', async () => {
      await request(app.getHttpServer())
        .delete(`/songs/1`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .get(`/songs/1`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 406 if id is not a number', async () => {
      const response = await request(app.getHttpServer())
        .delete('/songs/not-a-number')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(HttpStatus.NOT_ACCEPTABLE);

      expect(response.body.message).toContain('Validation failed');
    });

    it('should return 404 when deleting a non-existent song', async () => {
      await request(app.getHttpServer())
        .delete(`/songs/999999`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
