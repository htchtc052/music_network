import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Token, User } from '@prisma/client';
import { TokensResponse } from '../auth/responses/tokens.response';
import { JwtTokenDecoded } from './types/JwtPayload.type';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokensService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getUserByRefreshToken(refreshToken: string): Promise<User> {
    const user: User = await this.prisma.user.findFirst({
      where: {
        Token: {
          some: {
            refreshToken,
          },
        },
      },
      include: {
        Token: true,
      },
    });

    return user;
  }

  async deleteToken(refreshToken: string) {
    await this.prisma.token.delete({ where: { refreshToken } });
  }

  async decodeRefreshToken(refreshToken: string): Promise<JwtTokenDecoded> {
    let tokenPayload: JwtTokenDecoded;
    try {
      tokenPayload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      return tokenPayload;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async generateAndSaveTokens(user: User): Promise<TokensResponse> {
    const accessToken = await this.signAccessToken(user);
    const refreshToken = await this.signRefreshToken(user);

    await this.saveRefreshToken(user, refreshToken);
    return { tokens: { accessToken, refreshToken } };
  }

  async saveRefreshToken(user: User, refreshToken: string): Promise<Token> {
    const refreshTokenDecoded: JwtTokenDecoded = this.jwtService.decode(
      refreshToken,
    ) as JwtTokenDecoded | null;
    return this.prisma.token.create({
      data: {
        user: { connect: { id: user.id } },
        refreshToken,
        expiresAt: new Date(refreshTokenDecoded.iat * 1000),
        createdAt: new Date(refreshTokenDecoded.exp * 1000),
      },
    });
  }

  private async signAccessToken(user: User): Promise<string> {
    return this.jwtService.signAsync(
      { sid: uuidv4() },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_LIFE'),
        subject: user.id.toString(),
      },
    );
  }

  private async signRefreshToken(user: User): Promise<string> {
    return this.jwtService.signAsync(
      { sid: uuidv4() },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_LIFE'),
        subject: user.id.toString(),
      },
    );
  }
}
