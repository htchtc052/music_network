import { BadRequestException, INestApplication } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './dto/authResponse';
import { userMock } from '../users/mocks/users.mocks';
import {
  refreshTokenMock,
  tokensResponseMock,
} from '../tokens/mocks/tokens.mocks';
import { TokensResponse } from '../tokens/dtos/tokensResponse';

describe('AuthController', () => {
  let app: INestApplication;
  let authController: AuthController;
  const mockAuthService: AuthService =
    jest.createMockFromModule<AuthService>('./auth.service');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
      controllers: [AuthController],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    app = module.createNestApplication();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  const authResponseMock = {
    user: userMock,
    ...tokensResponseMock,
  };

  it('should register user', async () => {
    mockAuthService.register = jest.fn().mockResolvedValue(authResponseMock);

    const authResponse: AuthResponse = await authController.register({
      username: userMock.username,
      email: userMock.email,
      password: userMock.password,
    });

    expect(authResponse).toEqual(authResponseMock);
  });

  describe('login routes', () => {
    mockAuthService.login = jest
      .fn()
      .mockImplementation((loginDto: LoginDto) => {
        if (
          loginDto.email == userMock.email &&
          loginDto.password == userMock.password
        ) {
          return authResponseMock;
        } else {
          throw new BadRequestException('');
        }
      });

    it('should login user with valid credentials', async () => {
      const authResponse: AuthResponse = await authController.login({
        email: userMock.email,
        password: userMock.password,
      });

      expect(authResponse).toEqual(authResponseMock);
    });

    it('should throw error with invalid credentials', async () => {
      expect(() =>
        authController.login({
          email: 'invalid email',
          password: 'invalid password',
        }),
      ).toThrow(BadRequestException);
    });

    it('should refresh tokens', async () => {
      mockAuthService.refreshTokens = jest
        .fn()
        .mockResolvedValue(tokensResponseMock);

      const tokensResponse: TokensResponse = await authController.refreshTokens(
        { refreshToken: refreshTokenMock },
      );

      expect(tokensResponse).toEqual(tokensResponseMock);
    });
  });
});
