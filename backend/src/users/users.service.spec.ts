import { UsersService } from './users.service';
import { PrismaService } from 'nestjs-prisma';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { RegisterDto } from '../auth/dto/register.dto';
import { userMock } from './mocks/users.mocks';
import { editUserInfoDtoMock } from '../account/mocks/account.mocks';
import { UsersRepository } from './users.repository';
import { TrackResponse } from '../tracks/dtos/track.response';
import { UserResponse } from './dtos/userResponse';

describe('UsersService', () => {
  let usersService: UsersService;

  let mockUsersRepository: UsersRepository =
    jest.createMockFromModule<UsersRepository>('./users.repository');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        PrismaService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should create a new user', async () => {
    mockUsersRepository.createUser = jest.fn().mockResolvedValue(userMock);
    usersService.hashPassword = jest.fn().mockResolvedValue(userMock.password);

    const user: User = await usersService.createUser({
      username: userMock.username,
      email: userMock.email,
      password: userMock.password,
    } as RegisterDto);

    expect(user).toEqual(userMock);
  });

  it('should find user by id', async () => {
    mockUsersRepository.getUserById = jest.fn().mockResolvedValue(userMock);

    const user: User = await usersService.getUserById(userMock.id);

    expect(user).toEqual(user);
  });

  describe('editUserInfo', () => {
    it('Should update user info', async () => {
      const editedUserMock: User = {
        ...userMock,
        ...editUserInfoDtoMock,
      } as User;

      mockUsersRepository.updateUser = jest
        .fn()
        .mockResolvedValue(editedUserMock);

      const editedUserResponse: UserResponse = await usersService.editUserInfo(
        userMock,
        editUserInfoDtoMock,
      );

      expect(editedUserResponse).toEqual(new TrackResponse(editedUserMock));
    });
  });

  describe('deleteUser', () => {
    it('should mark user as deleted', async () => {
      mockUsersRepository.updateUser = jest
        .fn()
        .mockResolvedValue({ ...userMock, deletedAt: new Date() });

      const deletedUser: User = await usersService.softDeleteUser(userMock);

      expect(deletedUser).toEqual({ ...userMock, deletedAt: new Date() });
    });
  });
});
