import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsDateString,
  IsMilitaryTime,
} from 'class-validator';

export class CreateSongDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  artists: string[];

  @IsNotEmpty()
  @IsDateString()
  releaseDate: string;

  @IsNotEmpty()
  @IsMilitaryTime()
  duration: string;
}
