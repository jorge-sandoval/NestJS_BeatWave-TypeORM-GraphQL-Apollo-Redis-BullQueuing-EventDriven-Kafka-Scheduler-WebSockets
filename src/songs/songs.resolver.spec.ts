import { Test, TestingModule } from '@nestjs/testing';
import { SongsResolver } from './songs.resolver';
import { SongsService } from './songs.service';
import { PaginationResult } from '@common/interfaces/pagination-result.interface';
import { Song } from '@entities/song.entity';
import { faker } from '@faker-js/faker';
import { SongMapper } from './songs.mapper';
import { NotFoundException } from '@nestjs/common';
import { CreateSongInput, UpdateSongInput } from 'src/graphql';

describe('SongsResolver', () => {
  let resolver: SongsResolver;
  let songsService: jest.Mocked<SongsService>;

  let song1: Song;
  let song2: Song;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsResolver,
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

    resolver = module.get<SongsResolver>(SongsResolver);
    songsService = module.get<jest.Mocked<SongsService>>(SongsService);

    song1 = {
      id: 1,
      title: 'Test Song 1',
      duration: faker.date.anytime(),
      releasedDate: faker.date.anytime(),
      artists: undefined,
      playlists: undefined,
    };

    song2 = {
      id: 2,
      title: 'Test Song 2',
      duration: faker.date.anytime(),
      releasedDate: faker.date.anytime(),
      artists: undefined,
      playlists: undefined,
    };
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of GraphQLSong', async () => {
      const mockResult: PaginationResult<Song> = {
        items: [song1, song2],
        totalItems: 2,
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        prevPage: null,
        nextPage: null,
      };

      songsService.getAll.mockResolvedValue(mockResult);

      const result = await resolver.songs(1, 10);

      expect(songsService.getAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(mockResult.items.map(SongMapper.toGraphQLSong));
    });

    it('should return an empty array when no songs are found', async () => {
      const mockResult: PaginationResult<Song> = {
        items: [],
        totalItems: 0,
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        prevPage: null,
        nextPage: null,
      };

      songsService.getAll.mockResolvedValue(mockResult);

      const result = await resolver.songs(1, 10);

      expect(songsService.getAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return a song when found', async () => {
      songsService.getById.mockResolvedValue(song1);

      const result = await resolver.song(1);

      expect(songsService.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(SongMapper.toGraphQLSong(song1));
    });

    it('should throw NotFoundException when song not found', async () => {
      songsService.getById.mockRejectedValue(new NotFoundException());

      await expect(resolver.song(999)).rejects.toThrow(NotFoundException);

      expect(songsService.getById).toHaveBeenCalledWith(999);
    });
  });

  describe('createSong', () => {
    const createSongInput: CreateSongInput = {
      title: 'New Song',
      duration: '03:52',
      releasedDate: '2024-05-03',
      artistIds: ['1', '2'],
    };

    it('should create a new song and return it', async () => {
      songsService.create.mockResolvedValue(song1);

      const result = await resolver.createSong(createSongInput);

      expect(songsService.create).toHaveBeenCalledWith(
        expect.objectContaining(SongMapper.toCreateSongDto(createSongInput)),
      );
      expect(result).toEqual(SongMapper.toGraphQLSong(song1));
    });
  });

  describe('updateSong', () => {
    const updateSongInput: UpdateSongInput = {
      title: 'Updated Song',
    };

    it('should update an existing song and return it', async () => {
      const updated = { ...song1, title: 'Updated Song' };
      songsService.update.mockResolvedValue(updated);

      const result = await resolver.updateSong(
        1,
        updateSongInput,
        'some-user-agent',
      );

      expect(songsService.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining(SongMapper.toUpdateSongDto(updateSongInput)),
      );
      expect(result).toEqual(SongMapper.toGraphQLSong(updated));
    });
  });

  describe('deleteSong', () => {
    it('should delete a song and return true', async () => {
      songsService.delete.mockResolvedValue();

      const result = await resolver.deleteSong(1);

      expect(songsService.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('should handle errors when song not found', async () => {
      const songId = 999;
      songsService.delete.mockRejectedValue(new NotFoundException());

      await expect(resolver.deleteSong(songId)).rejects.toThrow(
        NotFoundException,
      );
      expect(songsService.delete).toHaveBeenCalledWith(songId);
    });
  });
});
