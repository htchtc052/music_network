import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokensService } from '../tokens/tokens.service';

import { AuthResponse } from './dto/authResponse';
import { TokensResponse } from '../tokens/dtos/tokensResponse';
import { UserResponse } from '../users/dtos/userResponse';
import { JwtParams } from '../tokens/types/JwtParams.type';
import { EmailConfirmationService } from '../email-confirmation/email-confirmation.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
    private emailConfirmationService: EmailConfirmationService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const user: User = await this.usersService.createUser(registerDto);

    const tokensResponse: TokensResponse = await this.generateAndSaveTokens(
      user.id,
    );

    await this.emailConfirmationService.sendEmailVerificationEmail(user);

    return {
      ...tokensResponse,
      user: new UserResponse(user),
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user: User = await this.usersService.getUserByEmail(loginDto.email);

    if (!(await this.validatePassword(user.password, loginDto.password)))
      throw new BadRequestException('Password is incorrect');

    const tokensResponse: TokensResponse = await this.generateAndSaveTokens(
      user.id,
    );

    return {
      ...tokensResponse,
      user: new UserResponse(user),
    };
  }

  async validatePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    try {
      return await argon2.verify(password, userPassword);
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Token ID required');
    }

    const payload: JwtParams = await this.tokensService.decodeJwtRefreshToken(
      refreshToken,
    );

    await this.usersService.deleteUserRefreshToken(+payload.sub, refreshToken);
  }

  async refreshTokens(refreshToken: string): Promise<TokensResponse> {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    const payload: JwtParams = await this.tokensService.decodeJwtRefreshToken(
      refreshToken,
    );

    const user: User = await this.usersService.checkUserByRefreshToken(
      refreshToken,
    );

    if (!user || user.id != parseInt(payload.sub)) {
      throw new BadRequestException('Refresh token not exists');
    }

    await this.usersService.deleteUserRefreshToken(+payload.sub, refreshToken);

    const tokens: TokensResponse = await this.generateAndSaveTokens(user.id);

    return new TokensResponse(tokens);
  }

  async generateAndSaveTokens(userId: number): Promise<TokensResponse> {
    const accessToken = await this.tokensService.signAccessToken(userId);

    const refreshToken = await this.tokensService.signRefreshToken(userId);

    await this.usersService.saveUserRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }
}
