import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { TokenUncheckedCreateInput } from './types/tokens.types';
import { Token } from '@prisma/client';

@Injectable()
export class TokensRepository {
  constructor(private prisma: PrismaService) {}

  async createToken(
    tokenCreateInput: TokenUncheckedCreateInput,
  ): Promise<Token> {
    return this.prisma.token.create({
      data: tokenCreateInput,
    });
  }

  async deleteByRefreshToken(refreshToken: string) {
    await this.prisma.token.delete({ where: { refreshToken } });
  }
}
