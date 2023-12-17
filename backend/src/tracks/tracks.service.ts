import { Injectable, NotFoundException } from '@nestjs/common';
import { Page, Track, TrackFile, User } from '@prisma/client';
import { EditTrackInfoDto } from './dtos/editTrackInfo.dto';
import { TrackResponse } from './dtos/track.response';
import { TracksRepository } from './tracksRepository';
import { TrackWithFile } from './types/track.types';
import { CreateTrackDto } from './dtos/createTrack.dto';
import { CreateTrackFileDto } from './dtos/createTrackFile.dto';
import { PagesService } from '../pages/pages.service';

@Injectable()
export class TracksService {
  constructor(
    private tracksRepository: TracksRepository,
    private pagesService: PagesService,
  ) {}

  async createTrackByUploadedFile(
    page: Page,
    uploadedFile: Express.Multer.File,
  ): Promise<TrackResponse> {
    const track: Track = await this.createTrack(page, {
      title: uploadedFile.originalname,
    });

    const trackFile: TrackFile = await this.createTrackFile(track.id, {
      filePath: uploadedFile.path,
      fileSize: uploadedFile.size,
      mimetype: uploadedFile.mimetype,
    });

    return new TrackResponse({ ...track, file: trackFile });
  }

  async createTrack(
    page: Page,
    createTrackDto: CreateTrackDto,
  ): Promise<Track> {
    return this.tracksRepository.createTrack({
      title: createTrackDto.title,
      userId: page.userId,
      pageId: page.id,
    });
  }

  async createTrackFile(
    trackId: number,
    createTrackFileDto: CreateTrackFileDto,
  ): Promise<TrackFile> {
    return this.tracksRepository.createTrackFile({
      fileSize: createTrackFileDto.fileSize,
      filePath: createTrackFileDto.filePath,
      mimetype: createTrackFileDto.mimetype,
      trackId,
    });
  }

  async getTrackById(id: number): Promise<TrackWithFile> {
    const track: TrackWithFile = await this.tracksRepository.getTrackById(id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async editTrackInfo(
    track: Track,
    editTrackInfoDto: EditTrackInfoDto,
  ): Promise<TrackResponse> {
    const updatedTrack: TrackWithFile = await this.tracksRepository.updateTrack(
      track.id,
      editTrackInfoDto,
    );

    return new TrackResponse(updatedTrack);
  }

  async markTrackDeleted(track: Track): Promise<Track> {
    const deletedTrack: Track = (await this.tracksRepository.updateTrack(
      track.id,
      {
        deletedAt: new Date(),
      },
    )) as Track;

    return deletedTrack;
  }

  async getTracksByPage(page: Page, guestUser: User): Promise<TrackResponse[]> {
    const includePrivate = this.pagesService.canReadPrivateData(
      page,
      guestUser,
    );

    const tracks: TrackWithFile[] = await this.tracksRepository.getTracksByPage(
      page,
      includePrivate,
    );

    return tracks.map((track: TrackWithFile) => new TrackResponse(track));
  }
}
