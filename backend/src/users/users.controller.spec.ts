import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { TracksService } from '../tracks/tracks.service';
import { UserResponse } from './dtos/userResponse';
import { userMock } from './mocks/users.mocks';
import { trackWithFileMock } from '../tracks/mocks/tracks.mocks';
import { TrackResponse } from '../tracks/dtos/track.response';

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
    it('should return user profile', async () => {
      const user: UserResponse = await usersController.getUserById(userMock);

      expect(user).toEqual(user);
    });

    it('should return user tracks', async () => {
      const tracksResponseMock: [TrackResponse] = [trackWithFileMock];
      jest
        .spyOn(mockTracksService, 'getTracksByUser')
        .mockResolvedValue(tracksResponseMock);

      const isOwner = true;

      const tracksResponse: TrackResponse[] =
        await usersController.getUserTracks(userMock, isOwner);

      expect(tracksResponse).toEqual(tracksResponseMock);
    });
  });
});
