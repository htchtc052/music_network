import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Page, Track, TrackFile } from '@prisma/client';
import {
  TrackFileUncheckedCreateInput,
  TrackUncheckedCreateInput,
  TrackUpdateInput,
  TrackWhereFilter,
  TrackWithFile,
} from './types/track.types';

@Injectable()
export class TracksRepository {
  constructor(private prisma: PrismaService) {}

  async createTrack(
    trackUncheckedCreateInput: TrackUncheckedCreateInput,
  ): Promise<Track> {
    return this.prisma.track.create({
      data: trackUncheckedCreateInput,
    });
  }

  async createTrackFile(
    trackCreateFileInput: TrackFileUncheckedCreateInput,
  ): Promise<TrackFile> {
    return this.prisma.trackFile.create({
      data: trackCreateFileInput,
    });
  }

  async getTracksByCriteria(
    trackWhereFilter: TrackWhereFilter,
  ): Promise<TrackWithFile[]> {
    const tracks: TrackWithFile[] = await this.prisma.track.findMany({
      where: {
        ...trackWhereFilter,
        deletedAt: null,
      },
      include: {
        file: true,
      },
    });

    return tracks;
  }

  async getTracksByPage(
    page: Page,
    includePrivate: boolean,
  ): Promise<TrackWithFile[]> {
    const where: TrackWhereFilter = {
      pageId: page.id,
      deletedAt: null,
    };

    if (!includePrivate) {
      where.private = false;
    }

    return this.getTracksByCriteria(where);
  }

  async getTrackById(id: number): Promise<TrackWithFile> {
    return this.prisma.track.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        file: true,
      },
    });
  }

  async updateTrack(
    trackId: number,
    updateTrackInput: TrackUpdateInput,
  ): Promise<TrackWithFile> {
    return this.prisma.track.update({
      where: { id: trackId },
      data: updateTrackInput,
      include: {
        file: true,
      },
    });
  }
}
