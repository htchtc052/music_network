import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { UserResponse } from '../users/dtos/userResponse';
import { User } from '@prisma/client';
import { SerializerInterceptor } from '../commons/serializerInterceptor';
import { UserProfile } from './decorators/userProfile.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { TracksService } from '../tracks/tracks.service';
import { PageResponse } from '../pages/dtos/page.response';
import { PagesService } from '../pages/pages.service';

@Controller('users')
export class UsersProfileController {
  constructor(
    private tracksService: TracksService,
    private pagesService: PagesService,
  ) {}

  @ApiOperation({ summary: 'Get user profile' })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Get(':id')
  @UseInterceptors(SerializerInterceptor)
  async getUserById(@UserProfile() userProfile: User): Promise<UserResponse> {
    return new UserResponse(userProfile);
  }

  @ApiOperation({ summary: 'Get user pages' })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Get(':id/pages')
  @UseInterceptors(SerializerInterceptor)
  getUserPages(@UserProfile() userProfile: User): Promise<PageResponse[]> {
    return this.pagesService.getPagesByUser(userProfile);
  }
}
