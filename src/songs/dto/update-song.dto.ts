import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateSongDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  artists?: string[];

  @IsOptional()
  @IsDateString()
  releaseDate?: Date;

  @IsOptional()
  @IsString()
  duration?: Date;
}
