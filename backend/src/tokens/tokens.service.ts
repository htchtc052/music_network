import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { JwtParams } from './types/JwtParams.type';

const TOKEN_SCOPES = {
  ACCESS_SCOPE: 'ACCESS',
  REFRESH_SCOPE: 'REFRESH_SCOPE',
  EMAIL_VERIFICATION_SCOPE: 'EMAIL_VERIFICATION',
};

@Injectable()
export class TokensService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  signAccessToken(userId: number) {
    return this.signToken(userId, TOKEN_SCOPES.ACCESS_SCOPE);
  }

  signRefreshToken(userId: number) {
    return this.signToken(userId, TOKEN_SCOPES.REFRESH_SCOPE);
  }

  signEmailVerificationToken(userId: number) {
    return this.signToken(userId, TOKEN_SCOPES.EMAIL_VERIFICATION_SCOPE);
  }

  private signToken(userId: number, scope: string) {
    let options: JwtSignOptions = {
      subject: userId.toString(),
    };

    if (scope === TOKEN_SCOPES.ACCESS_SCOPE) {
      options = {
        ...options,
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '5m',
      };
    } else if (scope === TOKEN_SCOPES.REFRESH_SCOPE) {
      options = {
        ...options,
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '1h',
      };
    } else if (scope === TOKEN_SCOPES.EMAIL_VERIFICATION_SCOPE) {
      options = {
        ...options,
        secret: this.configService.get<string>('JWT_EMAIL_VERIFICATION_SECRET'),
        expiresIn: '1h',
      };
    }

    return this.jwtService.signAsync({ sid: uuidv4() }, options);
  }

  decodeJwtAccessToken(token: string): Promise<JwtParams> {
    return this.decodeJwtToken(token, TOKEN_SCOPES.ACCESS_SCOPE);
  }

  decodeJwtRefreshToken(token: string): Promise<JwtParams> {
    return this.decodeJwtToken(token, TOKEN_SCOPES.REFRESH_SCOPE);
  }

  decodeJwtEmailVerificationToken(token: string): Promise<JwtParams> {
    return this.decodeJwtToken(token, TOKEN_SCOPES.EMAIL_VERIFICATION_SCOPE);
  }

  private async decodeJwtToken(
    token: string,
    scope: string,
  ): Promise<JwtParams> {
    let tokenPayload: JwtParams;

    let secret: string;

    if (scope === TOKEN_SCOPES.ACCESS_SCOPE) {
      secret = this.configService.get<string>('JWT_ACCESS_SECRET');
    } else if (scope === TOKEN_SCOPES.REFRESH_SCOPE) {
      secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    } else if (scope === TOKEN_SCOPES.EMAIL_VERIFICATION_SCOPE) {
      secret = this.configService.get<string>('JWT_EMAIL_VERIFICATION_SECRET');
    }

    try {
      tokenPayload = await this.jwtService.verifyAsync(token, {
        secret,
      });

      return tokenPayload;
    } catch (err) {
      if (err?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
