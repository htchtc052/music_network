import { ApiOperation } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EditUserInfoDto } from './dtos/editUserInfo.dto';
import { User } from '@prisma/client';
import { UserResponse } from '../users/dtos/userResponse';
import { SerializerInterceptor } from '../commons/serializerInterceptor';
import { AuthUser } from '../auth/decorators/authUser.decorator';
import { PageResponse } from '../pages/dtos/page.response';
import { PagesService } from '../pages/pages.service';
import { CreatePageDto } from '../pages/dtos/createPage.dto';

@Controller('account')
export class AccountController {
  constructor(
    private usersService: UsersService,
    private pagesService: PagesService,
  ) {}

  @ApiOperation({ summary: 'Edit user' })
  @HttpCode(HttpStatus.OK)
  @Put('editUserInfo')
  @UseInterceptors(SerializerInterceptor)
  editUserInfo(
    @AuthUser() user: User,
    @Body() editUserInfoDto: EditUserInfoDto,
  ): Promise<UserResponse> {
    return this.usersService.editUserInfo(user, editUserInfoDto);
  }

  @ApiOperation({ summary: 'Create page' })
  @HttpCode(HttpStatus.CREATED)
  @Post('createPage')
  @UseInterceptors(SerializerInterceptor)
  createPage(
    @AuthUser() authUser: User,
    @Body() createPageDto: CreatePageDto,
  ): Promise<PageResponse> {
    return this.pagesService.createPage(authUser, createPageDto);
  }

  @ApiOperation({ summary: 'Get user pages' })
  @HttpCode(HttpStatus.OK)
  @Get(':pages')
  @UseInterceptors(SerializerInterceptor)
  getUserPages(@AuthUser() user: User): Promise<PageResponse[]> {
    return this.pagesService.getPagesByUser(user);
  }

  @ApiOperation({ summary: 'Delete user' })
  @HttpCode(HttpStatus.OK)
  @Delete('deleteUser')
  async softDeleteUser(@AuthUser() user: User): Promise<string> {
    const deletedUser: User = await this.usersService.markUserDeleted(user.id);
    return `User ${deletedUser.id} successfully deleted`;
  }
}
