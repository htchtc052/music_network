import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../src/users/users.service';
import { IsEmailAlreadyExists } from '../src/users/validators/is-email-already-exists.service';
import { UsersRepository } from '../src/users/users.repository';
import { appSetup } from './utils/app.setup';
import { AppModule } from '../src/app.module';
import { AuthResponse } from '../src/auth/dto/authResponse';
import { User } from '@prisma/client';

describe('Auth register', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UsersService, IsEmailAlreadyExists, UsersRepository],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSetup(app);

    await app.init();

    usersService = moduleFixture.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await app.close();

    await usersService.deleteUser(user as unknown as User);
  });

  const email = 'test@mail.com';
  const password = 'test1230';
  const username = 'Test name';

  let user: AuthResponse;

  describe('Auth routes', () => {
    it('/auth/register (POST) - success', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email,
          password,
          username,
        });

      user = res.body as AuthResponse;

      expect(res.statusCode).toEqual(HttpStatus.CREATED);

      expect(user).toBeDefined();
      expect(typeof user.accessToken).toBe('string');
      expect(typeof user.refreshToken).toBe('string');
    });

    it('/auth/register (POST) - error exists email', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email,
          password,
          username,
        });

      expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toEqual('Email already exists');
    });
  });
});
