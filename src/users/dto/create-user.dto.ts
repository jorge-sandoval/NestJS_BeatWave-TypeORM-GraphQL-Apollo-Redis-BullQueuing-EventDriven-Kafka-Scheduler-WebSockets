import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Jane',
    description: 'provide the firstName of the user',
  })
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'provide the lastName of the user',
  })
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @ApiProperty({
    example: 'janedoe',
    description: 'provide the username of the user',
  })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({
    example: 'pa$$w0d!',
    description: 'provide the password of the user',
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({
    example: null,
    description: 'provide true to ativate api key',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly apiKey: boolean;
}
