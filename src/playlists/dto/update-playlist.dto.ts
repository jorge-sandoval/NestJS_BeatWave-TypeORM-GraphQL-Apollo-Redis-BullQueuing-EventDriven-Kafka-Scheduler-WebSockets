import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePlaylistDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly songIds?;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  readonly userId?: number;
}
