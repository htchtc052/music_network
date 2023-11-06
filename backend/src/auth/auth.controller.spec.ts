import { BadRequestException, INestApplication } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './dto/authResponse';
import { userMock } from '../users/mocks/users.mocks';
import { tokensResponse } from '../tokens/mocks/tokens.mocks';

describe('AuthController', () => {
  let app: INestApplication;
  let authController: AuthController;
  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

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
    ...userMock,
    ...tokensResponse,
  } as AuthResponse;

  it('should register user', async () => {
    jest.spyOn(mockAuthService, 'register').mockResolvedValue(authResponseMock);

    const authResponse: AuthResponse = await authController.register({
      username: userMock.username,
      email: userMock.email,
      password: userMock.password,
    });

    expect(authResponse).toEqual(authResponseMock);
  });

  describe('login routes', () => {
    jest
      .spyOn(mockAuthService, 'login')
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
  });
});
