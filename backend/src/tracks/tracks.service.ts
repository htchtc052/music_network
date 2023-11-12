import { Injectable, NotFoundException } from '@nestjs/common';
import { Track, TrackFile, User } from '@prisma/client';
import { EditTrackInfoDto } from './dtos/editTrackInfo.dto';
import { TrackResponse } from './dtos/track.response';
import { TracksRepository } from './tracksRepository';
import { TrackWhereFilter, TrackWithFile } from './types/track.types';
import { CreateTrackDto } from './dtos/createTrack.dto';
import { CreateTrackFileDto } from './dtos/createTrackFile.dto';

@Injectable()
export class TracksService {
  constructor(private tracksRepository: TracksRepository) {}

  async createTrackByUploadedFile(
    user: User,
    uploadedFile: Express.Multer.File,
  ): Promise<TrackResponse> {
    const track: Track = await this.createTrack(user.id, {
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
    userId: number,
    createTrackDto: CreateTrackDto,
  ): Promise<Track> {
    return this.tracksRepository.createTrack({
      title: createTrackDto.title,
      userId,
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

  async getTrackById(trackId: number): Promise<TrackWithFile> {
    const track: TrackWithFile = await this.tracksRepository.getTrackById(
      trackId,
    );

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

  async getTracksByUser(
    user: User,
    readAsOwner: boolean,
  ): Promise<TrackResponse[]> {
    const where: TrackWhereFilter = {
      userId: user.id,
      deletedAt: null,
    };

    if (!readAsOwner) {
      where.private = false;
    }
    const tracks: TrackWithFile[] =
      await this.tracksRepository.getTracksByCriteria(where);

    return tracks.map((track: TrackWithFile) => new TrackResponse(track));
  }

  async deleteTrack(track: Track): Promise<Track> {
    const deletedTrack: Track = (await this.tracksRepository.updateTrack(
      track.id,
      {
        deletedAt: new Date(),
      },
    )) as Track;

    return deletedTrack;
  }
}
