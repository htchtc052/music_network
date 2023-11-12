import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, User } from '@prisma/client';
import { UserUncheckedCreateInput, UserUpdateInput } from './types/user.types';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(userCreateInput: UserUncheckedCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: userCreateInput,
    });
  }

  getUserById(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  getUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  getUsersCountByEmail(email: string): Prisma.PrismaPromise<number> {
    return this.prisma.user.count({
      where: {
        email,
      },
    });
  }

  async getUserByRefreshToken(refreshToken: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        deletedAt: null,
        Token: {
          some: {
            refreshToken,
          },
        },
      },
    });
  }

  async updateUser(
    userId: number,
    updateUserInput: UserUpdateInput,
  ): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: updateUserInput,
    });
  }

  async deleteUserById(userId: number): Promise<User> {
    return this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
