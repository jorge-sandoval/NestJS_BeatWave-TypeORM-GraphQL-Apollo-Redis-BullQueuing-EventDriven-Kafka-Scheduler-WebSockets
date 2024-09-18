import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsNumber,
} from 'class-validator';

export class CreateSongDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly artistIds: number[];

  @IsNotEmpty()
  @IsDateString()
  readonly releasedDate: Date;

  @IsNotEmpty()
  @IsMilitaryTime()
  readonly duration: Date;
}
