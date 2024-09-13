import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  stageName: string;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
