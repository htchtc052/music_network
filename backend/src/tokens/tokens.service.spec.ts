import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { JwtTokenDecoded } from './types/JwtPayload.type';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { TokensService } from './tokens.service';

describe('TokensService', () => {
  let tokensService: TokensService;
  let prisma: PrismaService;

  const mockUsersService = {
    createUser: jest.fn(),
    findByEmail: jest.fn(),
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
        TokensService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue(accessToken),
            verifyAsync: jest.fn().mockResolvedValue(jwtPayload),
            decode: jest.fn().mockReturnValue(jwtPayload),
          },
        },
        { provide: ConfigService, useValue: {} },
        PrismaService,
      ],
    }).compile();

    tokensService = module.get<TokensService>(TokensService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(tokensService).toBeDefined();
  });
});
