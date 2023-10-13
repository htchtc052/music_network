import { Public } from '../auth/decorators/public.decorator';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { TransformTrackInterceptor } from '../tracks/interceptors/transormTrack.interceptor';
import { UserProfile } from './decorators/userProfile.decorator';
import { Track, User } from '@prisma/client';
import { IsOwner } from './decorators/isOwner.decorator';
import { UserEntity } from './entities/user.entity';
import { TracksService } from '../tracks/tracks.service';

@Controller('users/:id')
export class UsersController {
  constructor(private tracksService: TracksService) {}

  @Public()
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getUserById(@UserProfile() userProfile: User): Promise<UserEntity> {
    return new UserEntity(userProfile);
  }

  @Public()
  @Get('tracks')
  @UseInterceptors(TransformTrackInterceptor)
  async getUserTracks(
    @UserProfile() userProfile: User,
    @IsOwner() isOwner: boolean,
  ): Promise<Track[]> {
    const tracks: Track[] = await this.tracksService.getTracksByUser(
      userProfile,
      isOwner,
    );

    return tracks;
  }
}