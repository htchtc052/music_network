import { INestApplication } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { TracksService } from './tracks.service';
import { PoliciesGuard } from '../casl/policies.guard';
import { AbilityFactory } from '../casl/ability.factory';
import { ConfigService } from '@nestjs/config';
import { Track, TrackFile } from '@prisma/client';
import {
  editTrackInfoDtoMock,
  trackWithFileMock,
  uploadedTrackFileMock,
} from './mocks/tracks.mocks';
import { userMock } from '../users/mocks/users.mocks';
import { TrackResponse } from './dtos/track.response';
import { TrackWithFile } from './types/track.types';

describe('TracksController', () => {
  let app: INestApplication;
  let tracksController: TracksController;

  const mockTracksService: TracksService =
    jest.createMockFromModule<TracksService>('./tracks.service');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: TracksService,
          useValue: mockTracksService,
        },
        { provide: PoliciesGuard, useValue: {} },
        { provide: AbilityFactory, useValue: {} },
        { provide: ConfigService, useValue: {} },
      ],
      controllers: [TracksController],
    }).compile();

    tracksController = module.get<TracksController>(TracksController);
    app = module.createNestApplication();
  });

  it('should be defined', () => {
    expect(tracksController).toBeDefined();
  });

  it('should create a new track', async () => {
    const trackResultMock: TrackWithFile = {
      id: 1,
      userId: userMock.id,
      title: uploadedTrackFileMock.originalname,
      file: {
        trackId: 1,
        fileSize: uploadedTrackFileMock.size,
        filePath: uploadedTrackFileMock.path,
        mimetype: uploadedTrackFileMock.mimetype,
      } as TrackFile,
    } as TrackWithFile;

    mockTracksService.createTrackByUploadedFile = jest
      .fn()
      .mockResolvedValue(trackResultMock);

    const track: TrackResponse = await tracksController.createTrack(
      userMock,
      uploadedTrackFileMock,
    );

    expect(track).toEqual(trackResultMock);
  });

  it('should get track by id', async () => {
    const track: TrackResponse = tracksController.getTrack(trackWithFileMock);

    expect(track).toEqual(trackWithFileMock);
  });

  it('Should edit track info', async () => {
    const editedTrackMock: TrackResponse = {
      ...trackWithFileMock,
      ...editTrackInfoDtoMock,
    } as TrackResponse;

    mockTracksService.editTrackInfo = jest
      .fn()
      .mockResolvedValue(editedTrackMock);

    const editedTrack: TrackResponse = await tracksController.editInfo(
      trackWithFileMock,
      editTrackInfoDtoMock,
    );

    expect(editedTrack).toEqual(editedTrackMock);
  });

  it('should delete a track', async () => {
    const deletedTrackMock: Track = {
      ...trackWithFileMock,
      deletedAt: new Date(),
    } as Track;

    mockTracksService.deleteTrack = jest
      .fn()
      .mockResolvedValue(deletedTrackMock);

    const result: string = await tracksController.deleteTrack(
      trackWithFileMock,
    );

    expect(result).toEqual(`Track ${deletedTrackMock.id} successfully deleted`);
  });
});
