import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';
import { AuthResponse } from './responses/auth.response';
import { UserEntity } from '../users/entities/user.entity';
import { TokensResponse } from './responses/tokens.response';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtTokenDecoded } from '../tokens/types/JwtPayload.type';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const user: User = await this.usersService.createUser(registerDto);

    const tokens = await this.tokensService.generateAndSaveTokens(user);
    return {
      user: new UserEntity(user),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user: User = await this.usersService.findByEmail(loginDto.email);

    if (!user) throw new BadRequestException('User does not exist');

    if (!(await this.validatePassword(user.password, loginDto.password)))
      throw new BadRequestException('Password is incorrect');

    const tokens: TokensResponse =
      await this.tokensService.generateAndSaveTokens(user);
    return {
      user: new UserEntity(user),
      ...tokens,
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

    await this.tokensService.deleteToken(refreshToken);
  }

  async refreshTokens(refreshToken: string): Promise<TokensResponse> {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    let tokenPayload: JwtTokenDecoded =
      await this.tokensService.decodeRefreshToken(refreshToken);

    if (tokenPayload.exp * 1000 < Date.now()) {
      throw new HttpException(
        'Refresh token has expired',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user: User = await this.tokensService.getUserByRefreshToken(
      refreshToken,
    );

    await this.tokensService.deleteToken(refreshToken);

    return this.tokensService.generateAndSaveTokens(user);
  }
}
