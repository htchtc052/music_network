import { ApiOperation } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EditUserInfoDto } from './dtos/editUserInfo.dto';
import { AuthUser } from '../auth/decorators/authUser.decorator';
import { User } from '@prisma/client';
import { UserResponse } from '../users/dtos/userResponse';
import { SerializerInterceptor } from '../commons/serializerInterceptor';

@Controller('account')
export class AccountController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Edit user' })
  @HttpCode(HttpStatus.OK)
  @Put('editUserInfo')
  @UseInterceptors(SerializerInterceptor)
  editUserInfo(
    @AuthUser() authUser: User,
    @Body() editUserInfoDto: EditUserInfoDto,
  ): Promise<UserResponse> {
    return this.usersService.editUserInfo(authUser, editUserInfoDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @Delete('deleteUser')
  async softDeleteUser(@AuthUser() authUser: User): Promise<string> {
    const deletedUser: User = await this.usersService.softDeleteUser(authUser);
    return `User ${deletedUser.id} successfully deleted`;
  }
}
