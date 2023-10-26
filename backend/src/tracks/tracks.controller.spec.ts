import { INestApplication } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { TracksService } from './tracks.service';
import { PoliciesGuard } from '../casl/policies.guard';
import { AbilityFactory } from '../casl/ability.factory';
import { ConfigService } from '@nestjs/config';
import { mockUploadedTrackFile } from '../files/mocks/mockUploadedTrackFile';
import { Track, TrackFile, User } from '@prisma/client';
import { TrackEntity } from './entities/track.entity';
import { mockUser } from '../users/mocks/mockUser';
import { EditTrackInfoDto } from './dtos/editTrackInfo.dto';
import { mockEditTrackInfoDto } from './mocks/mockEditTrackInfoDto';
import { mockTrack } from './tracks/mockTrack';

describe('TracksController', () => {
  let app: INestApplication;
  let tracksController: TracksController;

  const mockTracksService = {
    createTrack: jest.fn(),
    editInfo: jest.fn(),
    deleteTrack: jest.fn(),
  };

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
    const uploadedTrackFileMock: Express.Multer.File = mockUploadedTrackFile();

    const userMock: User = mockUser();

    const mockCreatedTrack: TrackEntity = {
      createdAt: new Date(),
      deletedAt: null,
      description: '',
      file: {
        fileSize: uploadedTrackFileMock.size,
        filePath: uploadedTrackFileMock.path,
        mimetype: uploadedTrackFileMock.mimetype,
        trackId: 1,
      } as TrackFile,
      hiddenDescription: '',
      keywords: [],
      private: false,
      updatedAt: null,
      userId: userMock.id,
      title: uploadedTrackFileMock.originalname,
      id: 1,
    };

    jest
      .spyOn(mockTracksService, 'createTrack')
      .mockResolvedValue(mockCreatedTrack);

    const createdTrack: TrackEntity = await tracksController.createTrack(
      userMock,
      uploadedTrackFileMock,
    );

    expect(mockTracksService.createTrack).toHaveBeenCalledWith(
      userMock,
      uploadedTrackFileMock,
    );

    expect(createdTrack.userId).toEqual(userMock.id);
    expect(createdTrack.title).toEqual(uploadedTrackFileMock.originalname);
    expect(createdTrack.file.filePath).toEqual(uploadedTrackFileMock.path);
  });

  it('Should edit track info', async () => {
    const editTrackInfoDtoMock: EditTrackInfoDto = mockEditTrackInfoDto();
    const trackMock: Track = mockTrack();

    const updatedTrackMock: Track = { ...trackMock, ...editTrackInfoDtoMock };

    jest
      .spyOn(mockTracksService, 'editInfo')
      .mockResolvedValue(updatedTrackMock);

    const editedTrack: Track = await tracksController.editInfo(
      trackMock,
      editTrackInfoDtoMock,
    );

    expect(mockTracksService.editInfo).toHaveBeenCalledWith(
      trackMock,
      editTrackInfoDtoMock,
    );

    expect(editedTrack).toEqual(updatedTrackMock);
  });

  it('should delete a track', async () => {
    const trackMock: Track = mockTrack();

    jest.spyOn(mockTracksService, 'deleteTrack').mockResolvedValue(trackMock);

    const result: string = await tracksController.deleteTrack(trackMock);

    expect(mockTracksService.deleteTrack).toHaveBeenCalledWith(trackMock);
    expect(result).toEqual(`Track ${trackMock.id} successfully deleted`);
  });
});
