import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSongDto {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly artistIds: number[];

  @IsOptional()
  @IsDateString()
  readonly releaseDate?: Date;

  @IsOptional()
  @IsString()
  readonly duration?: Date;
}
