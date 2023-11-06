import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { JwtTokenDecoded } from './types/JwtPayload.type';
import { v4 as uuidv4 } from 'uuid';
import { TokensResponse } from './dtos/tokensResponse';
import { TokensRepository } from './tokens.repository';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class TokensService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private tokensRepository: TokensRepository,
    private usersRepository: UsersRepository,
  ) {}

  async saveRefreshToken(user: User, refreshToken: string): Promise<void> {
    const refreshTokenDecoded: JwtTokenDecoded = this.jwtService.decode(
      refreshToken,
    ) as JwtTokenDecoded | null;
    await this.tokensRepository.createToken({
      userId: user.id,
      refreshToken,
      expiresAt: new Date(refreshTokenDecoded.iat * 1000),
      createdAt: new Date(refreshTokenDecoded.exp * 1000),
    });
  }

  getUserByRefreshToken(refreshToken: string): Promise<User> {
    return this.usersRepository.getUserByRefreshToken(refreshToken);
  }

  async deleteToken(refreshToken: string) {
    await this.tokensRepository.deleteByRefreshToken(refreshToken);
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
    return { accessToken, refreshToken };
  }

  async signAccessToken(user: User): Promise<string> {
    return this.jwtService.signAsync(
      { sid: uuidv4() },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_LIFE'),
        subject: user.id.toString(),
      },
    );
  }

  async signRefreshToken(user: User): Promise<string> {
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
