import { PrismaService } from 'nestjs-prisma';
import { Track, TrackFile, User } from '@prisma/client';
import { mockUser } from '../users/mocks/mockUser';
import { Test, TestingModule } from '@nestjs/testing';
import { TracksService } from './tracks.service';
import { TrackEntity } from './entities/track.entity';
import { ConfigService } from '@nestjs/config';
import { mockTrack } from './tracks/mockTrack';
import { mockUploadedTrackFile } from '../files/mocks/mockUploadedTrackFile';
import { mockEditTrackInfoDto } from './mocks/mockEditTrackInfoDto';
import { EditTrackInfoDto } from './dtos/editTrackInfo.dto';

describe('TracksService', () => {
  let tracksService: TracksService;
  let prisma: PrismaService;

  const userMock: User = mockUser();
  const trackMock: Track = mockTrack();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TracksService, PrismaService, ConfigService],
    }).compile();

    tracksService = module.get<TracksService>(TracksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(tracksService).toBeDefined();
  });

  it('should create a new track', async () => {
    const uploadedTrackFileMock: Express.Multer.File = mockUploadedTrackFile();

    prisma.track.create = jest.fn().mockResolvedValue({
      userId: userMock.id,
      title: uploadedTrackFileMock.originalname,
      id: trackMock.id,
    } as Track);

    prisma.trackFile.create = jest.fn().mockResolvedValue({
      fileSize: uploadedTrackFileMock.size,
      filePath: uploadedTrackFileMock.path,
      mimetype: uploadedTrackFileMock.mimetype,
      trackId: trackMock.id,
    } as TrackFile);

    const result: TrackEntity = await tracksService.createTrack(
      userMock,
      uploadedTrackFileMock,
      false,
    );

    expect(prisma.track.create).toHaveBeenCalledWith({
      data: {
        title: uploadedTrackFileMock.originalname,
        userId: userMock.id,
      },
    });

    expect(prisma.trackFile.create).toHaveBeenCalledWith({
      data: {
        fileSize: uploadedTrackFileMock.size,
        filePath: uploadedTrackFileMock.path,
        mimetype: uploadedTrackFileMock.mimetype,
        trackId: trackMock.id,
      },
    });

    expect(result.userId).toEqual(userMock.id);
    expect(result.title).toEqual(uploadedTrackFileMock.originalname);
    expect(result.file.filePath).toEqual(uploadedTrackFileMock.path);
    expect(result.file.trackId).toEqual(trackMock.id);
  });

  describe('editInfo', () => {
    it('Should update track info', async () => {
      const editTrackInfoDtoMock: EditTrackInfoDto = mockEditTrackInfoDto();
      const updatedTrackMock: Track = { ...trackMock, ...editTrackInfoDtoMock };

      prisma.track.update = jest.fn().mockResolvedValueOnce(updatedTrackMock);

      const editedTrack: Track = await tracksService.editInfo(
        trackMock,
        editTrackInfoDtoMock,
      );

      expect(prisma.track.update).toHaveBeenCalledWith({
        where: { id: trackMock.id },
        data: {
          title: editTrackInfoDtoMock.title,
          description: editTrackInfoDtoMock.description,
          hiddenDescription: editTrackInfoDtoMock.hiddenDescription,
          private: editTrackInfoDtoMock.private,
        },
        include: {
          file: true,
        },
      });

      expect(editedTrack).toEqual(updatedTrackMock);
    });
  });

  describe('deleteTrack', () => {
    it('should mark track as deleted', async () => {
      const deletedTrackMock: Track = { ...trackMock, deletedAt: new Date() };

      prisma.track.update = jest.fn().mockResolvedValueOnce(deletedTrackMock);

      const deletedTrack: Track = await tracksService.deleteTrack(trackMock);

      expect(prisma.track.update).toHaveBeenCalledWith({
        where: { id: trackMock.id },
        data: {
          deletedAt: expect.any(Date),
        },
      });

      expect(deletedTrack).toEqual(deletedTrackMock);
    });
  });

  describe('GetTracksByUser', () => {
    const tracksMock: Track[] = [trackMock];

    it('should return tracks for user as owner', async () => {
      prisma.track.findMany = jest.fn().mockResolvedValueOnce(tracksMock);
      const readAsOwner = true;

      const result: Track[] = await tracksService.getTracksByUser(
        userMock,
        readAsOwner,
      );
      expect(prisma.track.findMany).toHaveBeenCalledWith({
        where: {
          userId: userMock.id,
          deletedAt: null,
        },
        include: {
          file: true,
        },
      });

      expect(result).toEqual(tracksMock);
    });

    it('should find track by ID with file', async () => {
      prisma.track.findUnique = jest.fn().mockResolvedValue(trackMock);

      const result: Track = await tracksService.findWithFileById(trackMock.id);

      expect(prisma.track.findUnique).toHaveBeenCalledWith({
        where: {
          id: trackMock.id,
          deletedAt: null,
        },
        include: {
          file: true,
        },
      });

      expect(result).toEqual(trackMock);
    });

    it('should return tracks for user as guest', async () => {
      prisma.track.findMany = jest.fn().mockResolvedValue(tracksMock);
      const readAsOwner = false;

      const result: Track[] = await tracksService.getTracksByUser(
        userMock,
        readAsOwner,
      );
      expect(prisma.track.findMany).toHaveBeenCalledWith({
        where: {
          userId: userMock.id,
          deletedAt: null,
          private: false,
        },
        include: {
          file: true,
        },
      });

      expect(result).toEqual(tracksMock);
    });
  });
});
