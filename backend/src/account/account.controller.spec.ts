import { INestApplication } from '@nestjs/common';
import { AccountController } from './account.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { mockEditUserInfoDto } from './mocks/mockEditUserInfo.dto';
import { EditUserInfoDto } from './dtos/editUserInfo.dto';
import { User } from '@prisma/client';
import { mockUser } from '../users/mocks/mockUser';
import { UserResponse } from '../users/responses/user.response';

describe('AccountController', () => {
  let app: INestApplication;
  let accountController: AccountController;

  const mockUsersService = {
    editInfo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        // { provide: PoliciesGuard, useValue: {} },
        // { provide: AbilityFactory, useValue: {} },
        //{ provide: ConfigService, useValue: {} },
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
    const authUserMock: User = mockUser();

    it('should return user profile', async () => {
      const result: UserResponse = await accountController.getUser(
        authUserMock,
      );

      expect(result.user).toEqual(authUserMock);
    });

    it('Should edit user info', async () => {
      const editUserInfoDtoMock: EditUserInfoDto = mockEditUserInfoDto();

      const updatedUserMock: User = { ...authUserMock, ...editUserInfoDtoMock };

      jest
        .spyOn(mockUsersService, 'editInfo')
        .mockResolvedValue(updatedUserMock);

      const result: UserResponse = await accountController.editInfo(
        authUserMock,
        editUserInfoDtoMock,
      );

      expect(mockUsersService.editInfo).toHaveBeenCalledWith(
        authUserMock,
        editUserInfoDtoMock,
      );

      expect(result.user).toEqual(updatedUserMock);
    });
  });
});
