import { INestApplication } from '@nestjs/common';
import { AccountController } from './account.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { UserResponse } from '../users/dtos/userResponse';
import { userMock } from '../users/mocks/users.mocks';
import { editUserInfoDtoMock } from './mocks/account.mocks';

describe('AccountController', () => {
  let app: INestApplication;
  let accountController: AccountController;

  const mockUsersService: UsersService =
    jest.createMockFromModule<UsersService>('../users/users.service');

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

      mockUsersService.editUserInfo = jest
        .fn()
        .mockResolvedValue(editedUserResponseMock);

      const editedUserResponse: UserResponse =
        await accountController.editUserInfo(userMock, editUserInfoDtoMock);

      expect(editedUserResponse).toEqual(editedUserResponseMock);
    });

    it('should delete a user', async () => {
      mockUsersService.softDeleteUser = jest.fn().mockResolvedValue({
        ...userMock,
        deletedAt: new Date(),
      });

      const result: string = await accountController.softDeleteUser(userMock);

      expect(result).toEqual(`User ${userMock.id} successfully deleted`);
    });
  });
});
