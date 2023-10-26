import { ApiOperation } from '@nestjs/swagger';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EditUserInfoDto } from './dtos/editUserInfo.dto';
import { UserEntity } from '../users/entities/user.entity';
import { AuthUser } from '../auth/decorators/authUser.decorator';
import { User } from '@prisma/client';
import { UserResponse } from '../users/responses/user.response';

@Controller('account')
export class AccountController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get own user' })
  @HttpCode(HttpStatus.OK)
  @Get('/me')
  @UseInterceptors(ClassSerializerInterceptor)
  async getUser(@AuthUser() authUser: User): Promise<UserResponse> {
    return { user: new UserEntity(authUser) };
  }

  @ApiOperation({ summary: 'Edit user' })
  @HttpCode(HttpStatus.OK)
  @Put('editInfo')
  @UseInterceptors(ClassSerializerInterceptor)
  async editInfo(
    @AuthUser() authUser: User,
    @Body() editUserInfoDto: EditUserInfoDto,
  ): Promise<UserResponse> {
    authUser = await this.usersService.editInfo(authUser, editUserInfoDto);

    return { user: new UserEntity(authUser) };
  }
}
