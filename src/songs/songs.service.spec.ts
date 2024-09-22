import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Song } from '@entities/song.entity';
import { Artist } from '@entities/artist.entity';
import { In, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';

describe('AppController', () => {
  let service: SongsService;
  let songsRepository: jest.Mocked<Repository<Song>>;
  let artistsRepository: jest.Mocked<Repository<Artist>>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: getRepositoryToken(Song),
          useValue: {
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Artist),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = app.get<SongsService>(SongsService);
    songsRepository = app.get<jest.Mocked<Repository<Song>>>(
      getRepositoryToken(Song),
    );
    artistsRepository = app.get<jest.Mocked<Repository<Artist>>>(
      getRepositoryToken(Artist),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get All', () => {
    it('should return paginated results', async () => {
      const mockSongs = Array(10).fill({ id: 1, title: 'Test Song' }) as Song[];
      const mockTotal = 25;

      songsRepository.findAndCount.mockResolvedValue([mockSongs, mockTotal]);

      const result = await service.getAll(2, 10);

      expect(result.currentPage).toBe(2);
      expect(result.pageSize).toBe(10);
      expect(result.totalPages).toBe(3);
      expect(result.prevPage).toBe(1);
      expect(result.nextPage).toBe(3);
    });
  });

  describe('Get By Id', () => {
    it('should return a song by id', async () => {
      const mockSong = { id: 1, title: 'Test Song' } as Song;
      songsRepository.findOne.mockResolvedValue(mockSong);

      const result = await service.getById(1);

      expect(result).toEqual(mockSong);
      expect(songsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [],
      });
    });

    it('should return a song by id with artists relation', async () => {
      const mockSongWithArtists = {
        id: 1,
        title: 'Test Song',
        artists: [],
      } as Song;
      songsRepository.findOne.mockResolvedValue(mockSongWithArtists);

      const result = await service.getById(1, true);

      expect(result).toEqual(mockSongWithArtists);
      expect(songsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['artists'],
      });
    });

    it('should throw NotFoundException if song not found', async () => {
      songsRepository.findOne.mockResolvedValue(null);

      await expect(service.getById(1)).rejects.toThrow(NotFoundException);
      expect(songsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [],
      });
    });
  });

  describe('Create', () => {
    it('should create and save a song without artists', async () => {
      const createSongDto = {
        title: 'New Song',
        duration: new Date(),
        releasedDate: new Date(),
        artistIds: [],
      } as CreateSongDto;

      const savedSong = {
        id: 1,
        ...createSongDto,
        artists: undefined,
        playlists: undefined,
      } as Song;

      songsRepository.save.mockResolvedValue(savedSong);

      const result = await service.create(createSongDto);

      expect(songsRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Song',
          duration: createSongDto.duration,
          releasedDate: createSongDto.releasedDate,
          artists: undefined,
        }),
      );
      expect(result).toEqual(savedSong);
    });

    it('should create and save a song with artists', async () => {
      const createSongDto = {
        title: 'New Song with Artists',
        duration: new Date(),
        releasedDate: new Date(),
        artistIds: [1, 2],
      };

      const mockArtists = [
        { id: 1, stageName: 'Artist 1' } as Artist,
        { id: 2, stageName: 'Artist 2' } as Artist,
      ];

      const savedSong = {
        id: 1,
        ...createSongDto,
        artists: mockArtists,
        playlists: [],
      } as Song;

      artistsRepository.find.mockResolvedValue(mockArtists);
      songsRepository.save.mockResolvedValue(savedSong);

      const result = await service.create(createSongDto);

      expect(artistsRepository.find).toHaveBeenCalledWith({
        where: { id: In([1, 2]) },
      });

      expect(songsRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Song with Artists',
          duration: createSongDto.duration,
          releasedDate: createSongDto.releasedDate,
          artists: mockArtists,
        }),
      );
      expect(result).toEqual(savedSong);
    });
  });

  describe('Update', () => {
    const existingSong = {
      id: 1,
      title: 'Old Song',
      duration: new Date(),
      releasedDate: new Date(),
      artists: [],
      playlists: undefined,
    } as Song;

    const mockArtists = [
      { id: 1, stageName: 'Artist 1' } as Artist,
      { id: 2, stageName: 'Artist 2' } as Artist,
    ];

    it('should update and save a song without updating artists', async () => {
      const updateSongDto = {
        title: 'Updated Song',
        duration: new Date(),
      };

      songsRepository.findOne.mockResolvedValue(existingSong);

      const updatedSong = { ...existingSong, ...updateSongDto };
      songsRepository.save.mockResolvedValue(updatedSong);

      const result = await service.update(1, updateSongDto);

      expect(songsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [],
      });

      expect(songsRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Updated Song',
          duration: updateSongDto.duration,
        }),
      );
      expect(result).toEqual(updatedSong);
    });

    it('should update a song and artists', async () => {
      const updateSongDto = {
        title: 'Updated Song with Artists',
        duration: new Date(),
        artistIds: [1, 2],
      };

      const updatedSong = {
        ...existingSong,
        ...updateSongDto,
        artists: mockArtists,
        playlists: undefined,
      };

      songsRepository.findOne.mockResolvedValue(existingSong);
      artistsRepository.find.mockResolvedValue(mockArtists);
      songsRepository.save.mockResolvedValue(updatedSong);

      const result = await service.update(1, updateSongDto);

      expect(artistsRepository.find).toHaveBeenCalledWith({
        where: { id: In([1, 2]) },
      });

      expect(songsRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Updated Song with Artists',
          duration: updateSongDto.duration,
          artists: mockArtists,
        }),
      );

      expect(result).toEqual(updatedSong);
    });

    it('should throw NotFoundException if song does not exist', async () => {
      const updateSongDto = {
        title: 'Non-existing Song',
        duration: new Date(),
      };

      songsRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, updateSongDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(songsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: [],
      });
    });
  });

  describe('Delete', () => {
    it('should delete a song if it exists', async () => {
      const mockSong = { id: 1, title: 'Test Song' } as Song;

      songsRepository.findOne.mockResolvedValue(mockSong);
      songsRepository.remove.mockResolvedValue(undefined);

      await service.delete(1);

      expect(songsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(songsRepository.remove).toHaveBeenCalledWith(mockSong);
    });

    it('should throw NotFoundException if the song does not exist', async () => {
      songsRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
      expect(songsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(songsRepository.remove).not.toHaveBeenCalled();
    });
  });
});
