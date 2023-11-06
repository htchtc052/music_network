import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokensService } from './tokens.service';
import { User } from '@prisma/client';
import { JwtTokenDecoded } from './types/JwtPayload.type';
import { TokensResponse } from './dtos/tokensResponse';
import {
  jwtPayloadMock,
  refreshTokenMock,
  tokensResponse,
} from './mocks/tokens.mocks';
import { userMock } from '../users/mocks/users.mocks';
import { UsersRepository } from '../users/users.repository';
import { TokensRepository } from './tokens.repository';

describe('TokensService', () => {
  let tokensService: TokensService;
  let jwtService: JwtService;

  let mockUsersRepository = {
    getUserByRefreshToken: jest.fn(),
  };

  let mockTokensRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokensService,

        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
            decode: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('MOCKED_SECRET_KEY'),
          },
        },
        {
          provide: TokensRepository,
          useValue: mockTokensRepository,
        },
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        JwtService,
      ],
    }).compile();

    tokensService = module.get<TokensService>(TokensService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(tokensService).toBeDefined();
  });

  it('should decode refresh token', async () => {
    jwtService.verifyAsync = jest.fn().mockResolvedValue(jwtPayloadMock);

    const jwtPayload: JwtTokenDecoded = await tokensService.decodeRefreshToken(
      refreshTokenMock,
    );

    expect(jwtPayload).toEqual(jwtPayloadMock);
  });

  it('should get user by refresh token', async () => {
    jest
      .spyOn(mockUsersRepository, 'getUserByRefreshToken')
      .mockResolvedValueOnce(userMock);

    const user: User = await tokensService.getUserByRefreshToken(
      refreshTokenMock,
    );

    expect(user).toEqual(userMock);
  });

  it('should generate tokens and save refresh token', async () => {
    jest
      .spyOn(tokensService, 'signAccessToken')
      .mockResolvedValueOnce(tokensResponse.accessToken);

    jest
      .spyOn(tokensService, 'signRefreshToken')
      .mockResolvedValueOnce(tokensResponse.refreshToken);

    jest
      .spyOn(tokensService, 'saveRefreshToken')
      .mockImplementation(() => Promise.resolve());

    const tokensResponseDto: TokensResponse =
      await tokensService.generateAndSaveTokens(userMock);

    expect(tokensResponseDto).toEqual(tokensResponseDto);
  });

  it('should sign access and refresh token', async () => {
    jest
      .spyOn(jwtService, 'signAsync')
      .mockResolvedValueOnce(tokensResponse.accessToken);

    jest
      .spyOn(jwtService, 'signAsync')
      .mockResolvedValueOnce(tokensResponse.refreshToken);

    const accessToken = await tokensService.signAccessToken(userMock);
    const refreshToken = await tokensService.signRefreshToken(userMock);

    expect({ accessToken, refreshToken }).toEqual(tokensResponse);
  });
});
