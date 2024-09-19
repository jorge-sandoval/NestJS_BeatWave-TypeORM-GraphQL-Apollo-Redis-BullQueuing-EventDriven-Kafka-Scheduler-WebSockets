import { ApiProperty } from '@nestjs/swagger';

export class LoginSuccessDto {
  @ApiProperty({ example: 'your-access-token' })
  accessToken: string;
}
