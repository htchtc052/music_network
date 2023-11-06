import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { BadRequestException } from '@nestjs/common';
import { TokensService } from '../tokens/tokens.service';
import { AuthResponse } from './dto/authResponse';
import { tokensResponse } from '../tokens/mocks/tokens.mocks';
import { userMock } from '../users/mocks/users.mocks';
import { UsersRepository } from '../users/users.repository';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUsersService = {
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
  };
  const mockUsersRepository = {};

  const mockTokensService = {
    generateAndSaveTokens: jest.fn(),
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
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Auth routes', () => {
    const authResponseDtoMock = {
      ...userMock,
      ...tokensResponse,
    } as AuthResponse;

    it('should create new user', async () => {
      jest
        .spyOn(mockUsersService, 'createUser')
        .mockResolvedValueOnce(userMock);

      jest
        .spyOn(mockTokensService, 'generateAndSaveTokens')
        .mockResolvedValue(tokensResponse);

      const authResponse: AuthResponse = await authService.register({
        username: userMock.username,
        email: userMock.email,
        password: userMock.password,
      });

      expect(authResponse).toEqual(authResponseDtoMock);
    });

    it('should login user with valid credentials', async () => {
      jest
        .spyOn(mockUsersService, 'getUserByEmail')
        .mockImplementation((checkEmail) => {
          if (checkEmail == userMock.email) {
            return userMock;
          } else {
            throw new BadRequestException('User does not exist');
          }
        });

      jest
        .spyOn(authService, 'validatePassword')
        .mockImplementation(async (hashedPassword, providedPassword) => {
          return hashedPassword == providedPassword;
        });

      jest
        .spyOn(mockTokensService, 'generateAndSaveTokens')
        .mockResolvedValue(tokensResponse);

      const authResponse: AuthResponse = await authService.login({
        email: userMock.email,
        password: userMock.password,
      });

      expect(authResponse).toEqual(authResponseDtoMock);
    });
  });
});
