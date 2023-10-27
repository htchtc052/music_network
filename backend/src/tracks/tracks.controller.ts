import { ApiOperation } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import RequestWithTrack from './interfaces/requestWithTrack.interface';
import { TrackEntity } from './entities/track.entity';
import { PoliciesGuard } from '../casl/policies.guard';
import { CheckPolicies } from '../casl/policies.decorator';
import { ReadTrackHandler } from '../casl/policies/readTrack.handler';
import { Track, User } from '@prisma/client';
import { AuthUser } from '../auth/decorators/authUser.decorator';
import { TracksService } from './tracks.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { EditTrackInfoDto } from './dtos/editTrackInfo.dto';
import { EditTrackHandler } from '../casl/policies/editTrack.handler';
import { TransformTrackInterceptor } from './interceptors/transormTrack.interceptor';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentTrack } from './decorators/currentTrack.decorator';

@Controller('tracks')
export class TracksController {
  constructor(
    private tracksService: TracksService,
    private configService: ConfigService,
  ) {}

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
  @UseInterceptors(ClassSerializerInterceptor)
  createTrack(
    @AuthUser() authUser: User,
    @UploadedFile()
    uploadedTrackFile: Express.Multer.File,
  ): Promise<TrackEntity> {
    return this.tracksService.createTrack(authUser, uploadedTrackFile);
  }

  @ApiOperation({ summary: 'Get track by id' })
  @Public()
  @Get(':id')
  @CheckPolicies(ReadTrackHandler)
  @UseGuards(PoliciesGuard)
  @UseInterceptors(TransformTrackInterceptor)
  getTrack(@Req() request: RequestWithTrack) {
    return new TrackEntity(request.track);
  }

  @ApiOperation({ summary: 'Edit track info' })
  @Put(':id/editInfo')
  @CheckPolicies(EditTrackHandler)
  @UseGuards(PoliciesGuard)
  @UseInterceptors(TransformTrackInterceptor)
  async editInfo(
    @CurrentTrack() track: Track,
    @Body() editTrackInfoDto: EditTrackInfoDto,
  ): Promise<TrackEntity> {
    const updatedTrack: Track = await this.tracksService.editInfo(
      track,
      editTrackInfoDto,
    );

    return new TrackEntity(updatedTrack);
  }

  @Delete(':id/delete')
  @CheckPolicies(EditTrackHandler)
  @UseGuards(PoliciesGuard)
  async deleteTrack(@CurrentTrack() track: Track): Promise<string> {
    const deletedTrack: Track = await this.tracksService.deleteTrack(track);

    return `Track ${deletedTrack.id} successfully deleted`;
  }
}
