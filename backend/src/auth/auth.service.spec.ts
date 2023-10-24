import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { JwtTokenDecoded } from '../tokens/types/JwtPayload.type';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { BadRequestException } from '@nestjs/common';
import { AuthResponse } from './responses/auth.response';
import * as argon2 from 'argon2';
import { UserEntity } from '../users/entities/user.entity';
import { mockTokensResponse } from './mocks/mockTokensResponse';
import { TokensResponse } from './responses/tokens.response';
import { TokensService } from '../tokens/tokens.service';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUsersService = {
    createUser: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockTokensService = {
    generateAndSaveTokens: jest.fn(),
  };

  let accessToken = faker.string.uuid();
  let jwtPayload: JwtTokenDecoded = {
    iat: 1689448480,
    exp: 1690053280,
    sub: faker.number.int(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: TokensService,
          useValue: mockTokensService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login routes', () => {
    it('should login user with valid credentials', async () => {
      const testPasswordUnhashed = 'testPassword';
      const testPassword = await argon2.hash(testPasswordUnhashed);

      const testUser: UserEntity = new UserEntity({
        email: 'Hazel.Reichel@hotmail.com',
        password: testPassword,
      });

      jest
        .spyOn(mockUsersService, 'findByEmail')
        .mockImplementation((email) => {
          if (email == testUser.email) {
            return testUser;
          } else {
            throw new BadRequestException('User does not exist');
          }
        });

      jest
        .spyOn(authService, 'validatePassword')
        .mockImplementation(async (hashedPassword, providedPassword) => {
          return argon2.verify(hashedPassword, providedPassword);
        });

      const tokensResponse: TokensResponse = mockTokensResponse();

      jest
        .spyOn(mockTokensService, 'generateAndSaveTokens')
        .mockResolvedValue(tokensResponse);

      const loginDto: LoginDto = {
        email: testUser.email,
        password: testPasswordUnhashed,
      };

      const authResponse: AuthResponse = await authService.login(loginDto);

      expect(mockUsersService.findByEmail).toBeCalledWith(loginDto.email);
      expect(authResponse).toBeTruthy();
    });
  });
});
