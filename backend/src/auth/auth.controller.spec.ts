import { BadRequestException, INestApplication } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { faker } from '@faker-js/faker';
import { UserEntity } from '../users/entities/user.entity';
import { AuthResponse } from './responses/auth.response';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let app: INestApplication;
  let authController: AuthController;
  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };
  const mockJwtAuthGuard = jest.fn();

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

  describe('Auth routes', () => {
    const mockAuthUser: UserEntity = new UserEntity({
      username: faker.internet.userName(),
      email: faker.internet.email(),
    });

    const mockAuthUserPassword = faker.internet.password();

    const mockAuthResponse: AuthResponse = {
      accessToken: faker.string.uuid(),
      refreshToken: faker.string.uuid(),
      tokenId: faker.string.uuid(),
      user: mockAuthUser,
    };

    it('should register user', async () => {
      const registerDto: RegisterDto = {
        username: mockAuthUser.username,
        email: mockAuthUser.email,
        password: mockAuthUserPassword,
      };

      jest
        .spyOn(mockAuthService, 'register')
        .mockResolvedValue(mockAuthResponse);

      const authResponse: AuthResponse = await authController.register(
        registerDto,
      );

      expect(mockAuthService.register).toBeCalledWith(registerDto);
      expect(authResponse).toBe(mockAuthResponse);
    });

    describe('login routes', () => {
      jest
        .spyOn(mockAuthService, 'login')
        .mockImplementation((loginDto: LoginDto) => {
          if (
            loginDto.email == mockAuthUser.email &&
            loginDto.password == mockAuthUserPassword
          ) {
            return mockAuthResponse;
          } else {
            throw new BadRequestException('');
          }
        });

      it('should login user with valid credentials', async () => {
        const loginDto: LoginDto = {
          email: mockAuthUser.email,
          password: mockAuthUserPassword,
        };

        const authResponse: AuthResponse = await authController.login(loginDto);

        expect(mockAuthService.login).toBeCalledWith(loginDto);
        expect(authResponse).toBe(mockAuthResponse);
      });

      it('should throw error with invalid credentials', async () => {
        const loginDto: LoginDto = {
          email: 'invalid email',
          password: 'invalid password',
        };

        jest
          .spyOn(mockAuthService, 'login')
          .mockImplementation((loginDto: LoginDto) => {
            if (
              loginDto.email === mockAuthUser.email &&
              loginDto.password === mockAuthUser.password
            ) {
              return mockAuthResponse;
            } else {
              throw new BadRequestException();
            }
          });

        expect(() => authController.login(loginDto)).toThrow(
          BadRequestException,
        );
      });
    });
  });
});
