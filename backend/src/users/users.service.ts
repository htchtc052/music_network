import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { v4 as uuid } from 'uuid';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';
import { EditUserInfoDto } from '../account/dtos/editUserInfo.dto';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService, //  private emailService: EmailService,
  ) {}

  async createUser(
    registerDto: RegisterDto,
    createActivated = false,
  ): Promise<User> {
    const hashedPassword = await argon2.hash(registerDto.password);
    registerDto.password = hashedPassword;

    let user: User;
    if (createActivated) {
      user = await this.prisma.user.create({
        data: { password: hashedPassword, ...registerDto },
      });
    } else {
      const activationToken: string = uuid();
      user = await this.prisma.user.create({
        data: { password: hashedPassword, activationToken, ...registerDto },
      });
    }

    return user;
  }

  editInfo(user: User, editUserInfoDto: EditUserInfoDto): Promise<User> {
    return this.prisma.user.update({
      where: { id: user.id },
      data: editUserInfoDto,
    });
  }

  findById(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async checkFieldBusy(
    fieldName: string,
    fieldValue: string,
  ): Promise<boolean> {
    return !(await this.prisma.user.count({
      where: {
        [fieldName]: fieldValue,
      },
    }));
  }
}
