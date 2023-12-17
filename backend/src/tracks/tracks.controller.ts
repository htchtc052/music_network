import { ApiOperation } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Track } from '@prisma/client';
import { TracksService } from './tracks.service';
import { EditTrackInfoDto } from './dtos/editTrackInfo.dto';
import { TransformTrackInterceptor } from './interceptors/transormTrack.interceptor';
import { Public } from '../auth/decorators/public.decorator';
import { TrackResponse } from './dtos/track.response';
import { TrackWithFile } from './types/track.types';
import { CurrentTrack } from './decorators/currentTrack.decorator';
import { CheckPolicies } from '../casl/policies.decorator';
import { ReadTrackHandler } from '../casl/policies/readTrack.handler';
import { PoliciesGuard } from '../casl/policies.guard';
import { EditTrackHandler } from '../casl/policies/editTrack.handler';

@Controller('tracks')
export class TracksController {
  constructor(private tracksService: TracksService) {}

  @ApiOperation({ summary: 'Get track by id' })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Get(':id')
  @CheckPolicies(ReadTrackHandler)
  @UseGuards(PoliciesGuard)
  @UseInterceptors(TransformTrackInterceptor)
  getTrack(@CurrentTrack() track: TrackWithFile): TrackResponse {
    return new TrackResponse(track);
  }

  @ApiOperation({ summary: 'Edit track info' })
  @HttpCode(HttpStatus.OK)
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

  @Delete(':id/deleteTrack')
  @CheckPolicies(EditTrackHandler)
  @UseGuards(PoliciesGuard)
  async deleteTrack(@CurrentTrack() track: TrackWithFile): Promise<string> {
    const deletedTrack: Track = await this.tracksService.markTrackDeleted(
      track,
    );

    return `Track ${deletedTrack.id} successfully deleted`;
  }
}
