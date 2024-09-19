import { ApiProperty } from '@nestjs/swagger';

export class Login2FADto {
  @ApiProperty({ example: 'http://example.com/auth/validate-2fa' })
  validate2FA: string;

  @ApiProperty({ example: 'Please complete 2FA' })
  message: string;
}
