import { ApiProperty } from '@nestjs/swagger';

export class TokensResponse {
  @ApiProperty()
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
