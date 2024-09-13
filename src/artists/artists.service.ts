import { Artist } from '@entities/artist.entity';
import { User } from '@entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArtistDto } from './dto/create-artist';
import { UpdateArtistDto } from './dto/update-artist';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const { stageName, userId } = createArtistDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const newArtist = this.artistRepository.create({
      stageName,
      user,
    });

    return this.artistRepository.save(newArtist);
  }

  async getById(id: number, includeSongs: boolean = false): Promise<Artist> {
    const relations = includeSongs ? ['user', 'songs'] : ['users'];
    const artist = await this.artistRepository.findOne({
      where: { id },
      relations,
    });

    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return artist;
  }

  async getByUserId(userId: number): Promise<Artist> {
    const artist = await this.artistRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with user ID ${userId} not found`);
    }
    return artist;
  }

  async update(id: number, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    const { stageName, userId } = updateArtistDto;

    if (stageName) {
      artist.stageName = stageName;
    }

    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      artist.user = user;
    }

    return this.artistRepository.save(artist);
  }

  async delete(id: number): Promise<void> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    await this.artistRepository.remove(artist);
  }
}
