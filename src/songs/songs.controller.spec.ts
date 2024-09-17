import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { HttpException, NotFoundException } from '@nestjs/common';
import { Song } from '@entities/song.entity';

describe('SongsController', () => {
  let controller: SongsController;
  let songsService: jest.Mocked<SongsService>;

  let song1: Song;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [
        {
          provide: SongsService,
          useValue: {
            getAll: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = app.get<SongsController>(SongsController);
    songsService = app.get<jest.Mocked<SongsService>>(SongsService);

    song1 = {
      id: 1,
      title: 'Bohemian Rhapsody',
      releasedDate: new Date('1975-10-31'),
      duration: new Date('1970-01-01T00:05:55'),
      artists: [],
      playlists: [],
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should fetch all the songs successfully', async () => {
      const songsResult = {
        items: [song1],
        totalItems: 10,
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        prevPage: null,
        nextPage: null,
      };
      songsService.getAll.mockResolvedValue(songsResult);

      const songs = await controller.getAll();

      expect(songs).toEqual(songsResult);
    });
  });

  describe('getById', () => {
    it('should return the song by id', async () => {
      songsService.getById.mockResolvedValue(song1);

      const song = await controller.getById(1);
      expect(song).toEqual(song1);
    });

    it('should handle not found error', async () => {
      songsService.getById.mockRejectedValue(new NotFoundException());

      await expect(controller.getById(99)).rejects.toThrow(HttpException);
    });
  });

  describe('create', () => {
    it('should create a new song successfully', async () => {
      const newSongDTO: Partial<CreateSongDto> = {
        title: 'Bohemian Rhapsody',
      };

      songsService.create.mockResolvedValue(song1);

      const song = await controller.create(newSongDTO as CreateSongDto);

      expect(songsService.create).toHaveBeenCalledWith(newSongDTO);
      expect(song).toEqual(song1);
    });
  });

  describe('update', () => {
    it('should update the song successfully', async () => {
      const updateSongDTO: UpdateSongDto = {
        title: 'Animals',
      };

      songsService.update.mockResolvedValue({
        ...song1,
        id: 15,
        title: 'Animals',
      });

      const song = await controller.update(15, updateSongDTO);

      expect(song).toEqual({ ...song1, id: 15, title: 'Animals' });
    });

    it('should handle not found error', async () => {
      const updateSongDTO: UpdateSongDto = {
        title: 'Animals',
      };

      songsService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update(15, updateSongDTO)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete the song successfully', async () => {
      songsService.delete.mockResolvedValue(undefined);

      await controller.delete(9);
      expect(songsService.delete).toHaveBeenCalledWith(9);
      expect(songsService.delete).toHaveBeenCalledTimes(1);
    });

    it('should handle not found error', async () => {
      songsService.delete.mockRejectedValue(new NotFoundException());

      await expect(controller.delete(9)).rejects.toThrow(NotFoundException);
    });
  });
});
