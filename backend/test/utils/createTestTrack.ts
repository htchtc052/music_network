import { TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { TracksService } from '../../src/tracks/tracks.service';
import { mockTrackFile } from '../mocks/mockTrackFile';
import { TrackEntity } from '../../src/tracks/entities/track.entity';

export const createTestTrack = async (
  moduleFixture: TestingModule,
  user: User,
  isPrivate: boolean,
): Promise<TrackEntity> => {
  const trackService: TracksService =
    moduleFixture.get<TracksService>(TracksService);
  const uploadedTrackFileMock: Express.Multer.File = mockTrackFile();
  return trackService.createTrackByUploadedFile(
    user,
    uploadedTrackFileMock,
    isPrivate,
  );
};
