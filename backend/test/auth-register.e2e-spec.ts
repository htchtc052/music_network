import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestingModule } from '@nestjs/testing';
import { appSetup } from './utils/app.setup';
import { User } from '@prisma/client';
import { RegisterDto } from '../src/auth/dto/register.dto';
import { PrismaService } from 'nestjs-prisma';
import { mockRegisterDto } from './mocks/mockUserData';
import { setupTestEnviroment } from './utils/setupTestEnviroment';

describe('Auth register', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await setupTestEnviroment();
    app = moduleFixture.createNestApplication();

    appSetup(app);

    await app.init();
  });

  afterAll(async () => {
    await app.close();

    const prismaService = moduleFixture.get<PrismaService>(PrismaService);

    prismaService.user.delete({ where: { id: user.id } });
  });

  const userData: RegisterDto = mockRegisterDto();

  let user: User;

  it('/auth/register (POST) - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData);

    user = res.body.user;

    expect(res.statusCode).toEqual(HttpStatus.CREATED);

    expect(user).toBeDefined();
    expect(typeof res.body.tokens.accessToken).toBe('string');
    expect(typeof res.body.tokens.refreshToken).toBe('string');
  });

  it('/auth/register (POST) - error exists email', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData);

    expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.message[0]).toEqual('Email already exists');
  });
});
