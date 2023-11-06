import { Public } from '../auth/decorators/public.decorator';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { TransformTrackInterceptor } from '../tracks/interceptors/transormTrack.interceptor';
import { UserProfile } from './decorators/userProfile.decorator';
import { User } from '@prisma/client';
import { IsOwner } from './decorators/isOwner.decorator';
import { TracksService } from '../tracks/tracks.service';
import { UserResponse } from './dtos/userResponse';
import { SerializerInterceptor } from '../commons/serializerInterceptor';
import { TrackResponse } from '../tracks/dtos/track.response';

@Controller('users')
export class UsersController {
  constructor(private tracksService: TracksService) {}

  @Public()
  @Get(':id')
  @UseInterceptors(SerializerInterceptor)
  async getUserById(@UserProfile() userProfile: User): Promise<UserResponse> {
    return new UserResponse(userProfile);
  }

  @Public()
  @Get(':id/tracks')
  @UseInterceptors(TransformTrackInterceptor)
  async getUserTracks(
    @UserProfile() userProfile: User,
    @IsOwner() isOwner: boolean,
  ): Promise<TrackResponse[]> {
    const tracksResponse: TrackResponse[] =
      await this.tracksService.getTracksByUser(userProfile, isOwner);

    return tracksResponse;
  }
}
