import { ApiOperation } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PoliciesGuard } from '../casl/policies.guard';
import { CheckPolicies } from '../casl/policies.decorator';
import { ReadTrackHandler } from '../casl/policies/readTrack.handler';
import { Track, User } from '@prisma/client';
import { AuthUser } from '../auth/decorators/authUser.decorator';
import { TracksService } from './tracks.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { EditTrackInfoDto } from './dtos/editTrackInfo.dto';
import { EditTrackHandler } from '../casl/policies/editTrack.handler';
import { TransformTrackInterceptor } from './interceptors/transormTrack.interceptor';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentTrack } from './decorators/currentTrack.decorator';
import { SerializerInterceptor } from '../commons/serializerInterceptor';
import { TrackResponse } from './dtos/track.response';
import { TrackWithFile } from './types/track.types';

@Controller('tracks')
export class TracksController {
  constructor(private tracksService: TracksService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('trackFile', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'audio/mpeg') {
          cb(null, true);
        } else {
          cb(new BadRequestException('File must be an mp3'), false);
        }
      },
    }),
  )
  @UseInterceptors(SerializerInterceptor)
  createTrack(
    @AuthUser() authUser: User,
    @UploadedFile()
    uploadedTrackFile: Express.Multer.File,
  ): Promise<TrackResponse> {
    return this.tracksService.createTrackByUploadedFile(
      authUser,
      uploadedTrackFile,
    );
  }

  @ApiOperation({ summary: 'Get track by id' })
  @Public()
  @Get(':id')
  @CheckPolicies(ReadTrackHandler)
  @UseGuards(PoliciesGuard)
  @UseInterceptors(TransformTrackInterceptor)
  getTrack(@CurrentTrack() track: TrackWithFile): TrackResponse {
    return new TrackResponse(track);
  }

  @ApiOperation({ summary: 'Edit track info' })
  @Put(':id/editTrackInfo')
  @CheckPolicies(EditTrackHandler)
  @UseGuards(PoliciesGuard)
  @UseInterceptors(TransformTrackInterceptor)
  editInfo(
    @CurrentTrack() track: TrackWithFile,
    @Body() editTrackInfoDto: EditTrackInfoDto,
  ): Promise<TrackResponse> {
    return this.tracksService.editTrackInfo(track, editTrackInfoDto);
  }

  @Delete(':id/delete')
  @CheckPolicies(EditTrackHandler)
  @UseGuards(PoliciesGuard)
  async deleteTrack(@CurrentTrack() track: TrackWithFile): Promise<string> {
    const deletedTrack: Track = await this.tracksService.deleteTrack(track);

    return `Track ${deletedTrack.id} successfully deleted`;
  }
}
