import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { TracksService } from '../tracks/tracks.service';
import { Track, User } from '@prisma/client';
import { mockTracks } from '../tracks/mocks/mockTracks';
import { mockUser } from './mocks/mockUser';

describe('UserController', () => {
  let app: INestApplication;
  let usersController: UsersController;
  const mockTracksService = {
    getTracksByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: TracksService,
          useValue: mockTracksService,
        },
      ],
      controllers: [UsersController],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    app = module.createNestApplication();
    //app.init();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('Users routes', () => {
    const userProfileMock: User = mockUser();

    it('should return user profile', async () => {
      const result = await usersController.getUserById(userProfileMock);

      expect(result.username).toEqual(userProfileMock.username);
    });

    it('should return user tracks', async () => {
      const tracksMock = mockTracks();

      jest
        .spyOn(mockTracksService, 'getTracksByUser')
        .mockResolvedValue(tracksMock);

      const isOwner = true;

      const result: Track[] = await usersController.getUserTracks(
        userProfileMock,
        isOwner,
      );

      expect(mockTracksService.getTracksByUser).toHaveBeenCalledWith(
        userProfileMock,
        true,
      );

      expect(result).toEqual(tracksMock);
    });
  });
});
