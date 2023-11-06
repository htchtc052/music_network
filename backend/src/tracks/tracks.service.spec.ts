import { PrismaService } from 'nestjs-prisma';
import { Track, TrackFile } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { TracksService } from './tracks.service';
import { ConfigService } from '@nestjs/config';
import {
  editTrackInfoDtoMock,
  trackMock,
  trackWithFileMock,
  uploadedTrackFileMock,
} from './mocks/tracks.mocks';
import { userMock } from '../users/mocks/users.mocks';
import { TrackResponse } from './dtos/track.response';
import { TracksRepository } from './tracksRepository';
import { TrackWithFile } from './types/track.types';

describe('TracksService', () => {
  let tracksService: TracksService;
  let mockTracksRepository = {
    createTrack: jest.fn(),
    createTrackFile: jest.fn(),
    getTrackById: jest.fn(),
    getTracksByCriteria: jest.fn(),
    updateTrack: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TracksService,
        PrismaService,
        ConfigService,
        {
          provide: TracksRepository,
          useValue: mockTracksRepository,
        },
      ],
    }).compile();

    tracksService = module.get<TracksService>(TracksService);
  });

  it('should be defined', () => {
    expect(tracksService).toBeDefined();
  });

  it('should create a new track', async () => {
    const trackMock: Track = {
      id: 1,
      userId: userMock.id,
      title: uploadedTrackFileMock.originalname,
    } as Track;

    const trackFileMock: TrackFile = {
      trackId: trackMock.id,
      fileSize: uploadedTrackFileMock.size,
      filePath: uploadedTrackFileMock.path,
      mimetype: uploadedTrackFileMock.mimetype,
    } as TrackFile;

    const trackResponseMock: TrackResponse = new TrackResponse({
      ...trackMock,
      file: trackFileMock,
    });

    jest
      .spyOn(mockTracksRepository, 'createTrack')
      .mockResolvedValue(trackMock);

    jest
      .spyOn(mockTracksRepository, 'createTrackFile')
      .mockResolvedValue(trackFileMock);

    const trackResponse: TrackResponse =
      await tracksService.createTrackByUploadedFile(
        userMock,
        uploadedTrackFileMock,
      );

    expect(trackResponse).toEqual(trackResponseMock);
  });

  describe('editTrackInfo', () => {
    it('Should update track info', async () => {
      const editedTrackMock: TrackWithFile = {
        ...trackMock,
        ...editTrackInfoDtoMock,
      } as TrackWithFile;

      jest
        .spyOn(mockTracksRepository, 'updateTrack')
        .mockResolvedValue(editedTrackMock);

      const editedTrackResponse: TrackResponse =
        await tracksService.editTrackInfo(trackMock, editTrackInfoDtoMock);

      expect(editedTrackResponse).toEqual(new TrackResponse(editedTrackMock));
    });
  });

  describe('GetTracksByUser', () => {
    it('should return tracks for user', async () => {
      const tracksResponseMock: TrackResponse[] = [trackWithFileMock];

      jest
        .spyOn(mockTracksRepository, 'getTracksByCriteria')
        .mockResolvedValue(tracksResponseMock);

      const tracksResponseDto: TrackResponse[] =
        await tracksService.getTracksByUser(userMock, true);

      expect(tracksResponseDto).toEqual(tracksResponseMock);
    });
  });

  describe('deleteTrack', () => {
    it('should mark track as deleted', async () => {
      const deletedTrackMock: Track = {
        ...trackMock,
        deletedAt: new Date(),
      } as Track;

      jest
        .spyOn(mockTracksRepository, 'updateTrack')
        .mockResolvedValue(deletedTrackMock);

      const deletedTrack: Track = await tracksService.deleteTrack(trackMock);

      expect(deletedTrack).toEqual(deletedTrackMock);
    });
  });
});
