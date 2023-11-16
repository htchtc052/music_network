import { Injectable, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { Token, User } from '@prisma/client';
import { EditUserInfoDto } from '../account/dtos/editUserInfo.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { UsersRepository } from './users.repository';
import { UserResponse } from './dtos/userResponse';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private tokensService: TokensService,
  ) {}

  async createUser(registerDto: RegisterDto): Promise<User> {
    const hashedPassword = await this.hashPassword(registerDto.password);

    const user: User = await this.usersRepository.createUser({
      password: hashedPassword,
      email: registerDto.email,
      username: registerDto.username,
    });

    return user;
  }

  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async getUserById(userId: number): Promise<User> {
    const user: User = await this.usersRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user: User = await this.usersRepository.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    return !(await this.usersRepository.getUsersCountByEmail(email));
  }

  async editUserInfo(
    user: User,
    editUserInfoDto: EditUserInfoDto,
  ): Promise<UserResponse> {
    const updatedUser: User = await this.usersRepository.updateUser(
      user.id,
      editUserInfoDto,
    );

    return new UserResponse(updatedUser);
  }

  async markUserDeleted(userId: number): Promise<User> {
    return this.usersRepository.updateUser(userId, { deletedAt: new Date() });
  }

  async markEmailAsConfirmed(userId: number) {
    return this.usersRepository.updateUser(userId, {
      emailConfirmedAt: new Date(),
    });
  }

  async saveUserRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    await this.usersRepository.createRefreshToken({
      refreshToken,
      userId,
    });
  }

  async checkUserByRefreshToken(refreshToken: string): Promise<User> {
    const token: Token = await this.usersRepository.getUserToken({
      refreshToken,
    });

    const user: User = await this.usersRepository.getUserById(token.userId);

    return user;
  }

  deleteUserRefreshToken(userId: number, refreshToken: string) {
    return this.usersRepository.deleteUserToken({ userId, refreshToken });
  }
}
