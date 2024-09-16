import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    example: 'janedoe',
    description: 'provide the username of the user',
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    example: 'pa$$w0d!',
    description: 'provide the password of the user',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
