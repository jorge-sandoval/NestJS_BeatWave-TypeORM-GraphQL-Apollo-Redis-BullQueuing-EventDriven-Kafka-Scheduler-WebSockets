import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';

describe('AppController', () => {
  let service: SongsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [SongsService],
    }).compile();

    service = app.get<SongsService>(SongsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
