import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { BadRequestException } from '@nestjs/common';
import { TokensService } from '../tokens/tokens.service';
import { AuthResponse } from './dto/authResponse';
import { tokensResponseMock } from '../tokens/mocks/tokens.mocks';
import { userMock } from '../users/mocks/users.mocks';
import { EmailService } from '../email/email.service';
import { TokensResponse } from '../tokens/dtos/tokensResponse';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthorizationTokenDecoded } from '../tokens/types/JwtAuthorization.type';
import { EmailConfirmationService } from '../email-confirmation/email-confirmation.service';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUsersService: UsersService = jest.createMockFromModule(
    '../users/users.service',
  );

  const mockTokensService: TokensService = jest.createMockFromModule(
    '../tokens/tokens.service',
  );

  const mockEmailService: EmailService = jest.createMockFromModule(
    '../email/email.service',
  );

  const mockEmailConfirmationService: EmailConfirmationService =
    jest.createMockFromModule(
      '../email-confirmation/email-confirmation.service.ts',
    );

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
          provide: EmailConfirmationService,
          useValue: mockEmailConfirmationService,
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
      user: userMock,
      ...tokensResponseMock,
    };

    it('should create new user', async () => {
      mockUsersService.createUser = jest.fn().mockResolvedValueOnce(userMock);

      authService.generateAndSaveTokens = jest
        .fn()
        .mockResolvedValue(tokensResponseMock);

      mockEmailConfirmationService.sendEmailVerificationEmail = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      const registerDto: RegisterDto = {
        username: userMock.username,
        email: userMock.email,
        password: userMock.password,
      };

      const authResponse: AuthResponse = await authService.register(
        registerDto,
      );

      expect(mockUsersService.createUser).toHaveBeenCalledWith(registerDto);

      expect(authResponse).toEqual(authResponseDtoMock);
    });

    it('should login user with valid credentials', async () => {
      mockUsersService.getUserByEmail = jest
        .fn()
        .mockImplementation((checkEmail) => {
          if (checkEmail == userMock.email) {
            return userMock;
          } else {
            throw new BadRequestException('User does not exist');
          }
        });

      authService.validatePassword = jest
        .fn()
        .mockImplementation((password1, password2) => {
          return password1 === password2;
        });

      authService.generateAndSaveTokens = jest
        .fn()
        .mockResolvedValue(tokensResponseMock);

      const loginDto: LoginDto = {
        email: userMock.email,
        password: userMock.password,
      };

      const authResponse: AuthResponse = await authService.login(loginDto);

      expect(mockUsersService.getUserByEmail).toHaveBeenCalledWith(
        userMock.email,
      );

      expect(authService.validatePassword).toHaveBeenCalledWith(
        userMock.password,
        userMock.password,
      );

      expect(authService.generateAndSaveTokens).toHaveBeenCalledWith(
        userMock.id,
      );

      expect(authResponse).toEqual(authResponseDtoMock);
    });

    it('should refresh tokens', async () => {
      mockTokensService.decodeJwtRefreshToken = jest.fn().mockResolvedValue({
        sub: userMock.id.toString(),
      } as JwtAuthorizationTokenDecoded);

      mockUsersService.checkUserByRefreshToken = jest
        .fn()
        .mockResolvedValue(userMock);

      mockUsersService.deleteUserRefreshToken = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      authService.generateAndSaveTokens = jest
        .fn()
        .mockResolvedValue(tokensResponseMock);

      const tokensResponse: TokensResponse = await authService.refreshTokens(
        tokensResponseMock.refreshToken,
      );

      expect(authService.generateAndSaveTokens).toHaveBeenCalledWith(
        userMock.id,
      );

      expect(tokensResponse).toEqual(tokensResponseMock);
    });
  });
});
