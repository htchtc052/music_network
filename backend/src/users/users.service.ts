import { Injectable, NotFoundException } from '@nestjs/common';

import { v4 as uuid } from 'uuid';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';
import { EditUserInfoDto } from '../account/dtos/editUserInfo.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { UsersRepository } from './users.repository';
import { UserResponse } from './dtos/userResponse';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(registerDto: RegisterDto): Promise<User> {
    const hashedPassword = await this.hashPassword(registerDto.password);

    const activationToken: string = uuid();
    const user: User = await this.usersRepository.createUser({
      password: hashedPassword,
      email: registerDto.email,
      username: registerDto.username,
      activationToken,
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

  async softDeleteUser(user: User): Promise<User> {
    return this.usersRepository.updateUser(user.id, { deletedAt: new Date() });
  }
}
