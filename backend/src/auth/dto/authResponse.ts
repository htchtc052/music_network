import { IntersectionType } from '@nestjs/swagger';
import { UserResponse } from '../../users/dtos/userResponse';
import { TokensResponse } from '../../tokens/dtos/tokensResponse';

export class AuthResponse extends IntersectionType(
  UserResponse,
  TokensResponse,
) {
  constructor(partial?: Partial<AuthResponse>) {
    super();
    Object.assign(this, partial);
  }
}
