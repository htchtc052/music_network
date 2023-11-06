import { INestApplication } from '@nestjs/common';
import { AccountController } from './account.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { UserResponse } from '../users/dtos/userResponse';
import { userMock } from '../users/mocks/users.mocks';
import { editUserInfoDtoMock } from './mocks/account.mocks';
import { User } from '@prisma/client';

describe('AccountController', () => {
  let app: INestApplication;
  let accountController: AccountController;

  const mockUsersService = {
    editUserInfo: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
      controllers: [AccountController],
    }).compile();

    accountController = module.get<AccountController>(AccountController);
    app = module.createNestApplication();
  });

  it('should be defined', () => {
    expect(AccountController).toBeDefined();
  });

  describe('Account routes', () => {
    it('Should edit user info', async () => {
      const editedUserResponseMock: UserResponse = {
        ...userMock,
        ...editUserInfoDtoMock,
      } as UserResponse;

      jest
        .spyOn(mockUsersService, 'editUserInfo')
        .mockResolvedValue(editedUserResponseMock);

      const editedUserResponse: UserResponse =
        await accountController.editUserInfo(userMock, editUserInfoDtoMock);

      expect(editedUserResponse).toEqual(editedUserResponseMock);
    });

    it('should delete a user', async () => {
      const deletedUserMock: User = {
        ...userMock,
        deletedAt: new Date(),
      } as User;

      jest
        .spyOn(mockUsersService, 'deleteUser')
        .mockResolvedValue(deletedUserMock);

      const result: string = await accountController.deleteUser(userMock);

      expect(result).toEqual(`User ${deletedUserMock.id} successfully deleted`);
    });
  });
});
