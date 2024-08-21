import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';

describe('AppController', () => {
  let controller: SongsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [SongsService],
    }).compile();

    controller = app.get<SongsController>(SongsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
