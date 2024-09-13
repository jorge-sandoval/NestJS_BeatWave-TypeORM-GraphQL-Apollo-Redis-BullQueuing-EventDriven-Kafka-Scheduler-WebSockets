import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateArtistDto {
  @IsString()
  @IsOptional()
  stageName?: string;

  @IsInt()
  @IsOptional()
  userId?: number;
}
