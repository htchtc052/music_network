import { AuthService } from '../../src/auth/auth.service';
import { AuthResponse } from '../../src/auth/responses/auth.response';
import { TestingModule } from '@nestjs/testing';
import { RegisterDto } from '../../src/auth/dto/register.dto';

export const registerTestUser = async (
  moduleFixture: TestingModule,
  mockUserData: RegisterDto,
): Promise<AuthResponse> => {
  const authService: AuthService = moduleFixture.get<AuthService>(AuthService);
  const userData: RegisterDto = mockUserData;
  return authService.register(userData);
};
