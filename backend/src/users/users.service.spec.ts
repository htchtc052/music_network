import { UsersService } from './users.service';
import { PrismaService } from 'nestjs-prisma';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterDto } from '../auth/dto/register.dto';
import * as argon2 from 'argon2';
import { mockUser } from './mocks/mockUser';
import { User } from '@prisma/client';
import { mockRegisterDto } from '../auth/mocks/mockRegisterDto';
import { EditUserInfoDto } from '../account/dtos/editUserInfo.dto';
import { mockEditUserInfoDto } from '../account/mocks/mockEditUserInfo.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let prisma: PrismaService;

  const userMock: User = mockUser();
  const registerDtoMock: RegisterDto = mockRegisterDto();
  const editUserInfoDtoMock: EditUserInfoDto = mockEditUserInfoDto();
  let hashedPassword: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);

    hashedPassword = await argon2.hash(registerDtoMock.password);

    jest.spyOn(usersService, 'hashPassword').mockResolvedValue(hashedPassword);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should create a new user', async () => {
    prisma.user.create = jest.fn().mockResolvedValue({
      username: registerDtoMock.username,
      email: registerDtoMock.email,
      password: hashedPassword,
    } as User);

    const result: User = await usersService.createUser(registerDtoMock);

    expect(result.username).toEqual(userMock.username);
    expect(result.password).toEqual(hashedPassword);
  });

  it('should update user info', async () => {
    prisma.user.update = jest.fn().mockResolvedValue({
      firstName: editUserInfoDtoMock.firstName,
      lastName: editUserInfoDtoMock.lastName,
    } as User);

    const result: User = await usersService.editInfo(
      userMock,
      editUserInfoDtoMock,
    );

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: userMock.id },
      data: editUserInfoDtoMock,
    });

    expect(result.firstName).toEqual(editUserInfoDtoMock.firstName);
    expect(result.lastName).toEqual(editUserInfoDtoMock.lastName);
  });

  it('should find user by id', async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue(userMock);

    const result: User = await usersService.findById(userMock.id);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: userMock.id,
      },
    });

    expect(result).toEqual(userMock);
  });

  it('should find user by email', async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue(userMock);

    const result: User = await usersService.findByEmail(userMock.email);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        email: userMock.email,
      },
    });

    expect(result).toEqual(userMock);
  });
});
