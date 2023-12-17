import { PrismaService } from 'nestjs-prisma';
import { Page, Track, TrackFile, User } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { TracksService } from './tracks.service';
import { ConfigService } from '@nestjs/config';

import { TrackResponse } from './dtos/track.response';
import { TracksRepository } from './tracksRepository';
import { TrackWithFile } from './types/track.types';
import { EditTrackInfoDto } from './dtos/editTrackInfo.dto';
import { PagesService } from '../pages/pages.service';

describe('TracksService', () => {
  let tracksService: TracksService;
  let mockTracksRepository: TracksRepository =
    jest.createMockFromModule<TracksRepository>('./tracksRepository');

  let mockPagesService: PagesService = jest.createMockFromModule<PagesService>(
    '../pages/pages.service',
  );

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
        {
          provide: PagesService,
          useValue: mockPagesService,
        },
      ],
    }).compile();

    tracksService = module.get<TracksService>(TracksService);
  });

  it('should be defined', () => {
    expect(tracksService).toBeDefined();
  });

  it('should upload track to page', async () => {
    const user: User = { id: 1 } as User;
    const page: Page = { id: 1, userId: user.id } as Page;

    const uploadedTrackFileMock: Express.Multer.File = {
      originalname: 'test_track.mp3',
      size: 1024,
      path: '/pathtofile',
      buffer: undefined,
      filename: 'test_str.mp3',
      destination: '/dest_folder',
      stream: undefined,
      mimetype: 'audio/mpeg',
    } as Express.Multer.File;

    const trackMock: Track = {
      id: 1,
      userId: page.userId,
      pageId: page.id,
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

    tracksService.createTrack = jest.fn().mockResolvedValue(trackMock);

    tracksService.createTrackFile = jest.fn().mockResolvedValue(trackFileMock);

    const trackResponse: TrackResponse =
      await tracksService.createTrackByUploadedFile(
        page,
        uploadedTrackFileMock,
      );

    expect(trackResponse).toEqual(trackResponseMock);
  });

  describe('editTrackInfo', () => {
    it('Should update track info', async () => {
      const trackMock: Track = {
        id: 1,
        title: 'Track 1',
      } as Track;

      const editTrackInfoDtoMock: EditTrackInfoDto = {
        title: 'Edited title',
      } as EditTrackInfoDto;

      const editedTrackMock: TrackWithFile = {
        ...trackMock,
        ...editTrackInfoDtoMock,
      } as TrackWithFile;

      mockTracksRepository.updateTrack = jest
        .fn()
        .mockResolvedValue(editedTrackMock);

      const editedTrackResponse: TrackResponse =
        await tracksService.editTrackInfo(trackMock, editTrackInfoDtoMock);

      expect(editedTrackResponse).toEqual(new TrackResponse(editedTrackMock));
    });
  });

  describe('GetTracksByPage', () => {
    const ownerUser: User = { id: 1 } as User;
    const page: Page = { id: 1, userId: ownerUser.id } as Page;

    const guestUser: User = { id: 2 } as User;

    const tracksResponseMock: TrackResponse[] = [
      {
        id: 1,
        userId: ownerUser.id,
        pageId: page.id,
        private: false,
      } as TrackWithFile,
      {
        id: 2,
        userId: ownerUser.id,
        pageId: page.id,
        private: true,
      } as TrackWithFile,
    ];

    mockPagesService.canReadPrivateData = jest
      .fn()
      .mockImplementation((page: Page, guestUser: User): boolean => {
        return page.userId === guestUser.id;
      });

    mockTracksRepository.getTracksByPage = jest
      .fn()
      .mockImplementation((page: Page, includePrivate: boolean) => {
        return tracksResponseMock.filter(
          (track) =>
            track.pageId == page.id && (includePrivate || !track.private),
        );
      });

    it('should return all two tracks for owner user', async () => {
      const tracksResponseDto: TrackResponse[] =
        await tracksService.getTracksByPage(page, ownerUser);
      expect(tracksResponseDto.length).toEqual(2);
    });

    it('should return all only public track for guest user', async () => {
      const tracksResponseDto: TrackResponse[] =
        await tracksService.getTracksByPage(page, guestUser);
      expect(tracksResponseDto.length).toEqual(1);
    });
  });

  describe('deleteTrack', () => {
    it('should mark track as deleted', async () => {
      const trackMock: Track = { id: 1 } as Track;
      const deletedAt = new Date();
      const deletedTrackMock: Track = { ...trackMock, deletedAt } as Track;

      mockTracksRepository.updateTrack = jest
        .fn()
        .mockResolvedValue(deletedTrackMock);

      const deletedTrack: Track = await tracksService.markTrackDeleted(
        trackMock,
      );

      expect(deletedTrack).toEqual(deletedTrackMock);
    });
  });
});
