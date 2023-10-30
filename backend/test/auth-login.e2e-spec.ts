import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthResponse } from '../src/auth/responses/auth.response';
import { TestingModule } from '@nestjs/testing';
import { setupTestEnviroment } from './utils/setupTestEnviroment';
import { registerTestUser } from './utils/registerTestUser';
import { deleteTestUser } from './utils/deleteTestUser';
import { mockRegisterDto } from './mocks/mockUserData';

describe('Auth login', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  let authResponse: AuthResponse;

  const mockUserData = mockRegisterDto();

  beforeAll(async () => {
    moduleFixture = await setupTestEnviroment();
    app = moduleFixture.createNestApplication();

    authResponse = await registerTestUser(moduleFixture, mockUserData);

    await app.init();
  });

  afterAll(async () => {
    await app.close();

    await deleteTestUser(moduleFixture, authResponse.user);
  });

  it('/auth/login (POST) - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: mockUserData.email, password: mockUserData.password });

    expect(res.statusCode).toEqual(HttpStatus.OK);
    expect(typeof res.body.tokens.accessToken).toBe('string');
    expect(typeof res.body.tokens.refreshToken).toBe('string');
    expect(res.body.user).toBeDefined();
  });

  it('/auth/login (POST) - not found login', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'not_exists@email.com',
      password: mockUserData.password,
    });

    expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.message).toEqual('User does not exist');
  });

  it('/auth/login (POST) - wrong password', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: mockUserData.email,
      password: 'wrong_password',
    });

    expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.message).toEqual(`Password is incorrect`);
  });

  it('/auth/refreshToken (POST) - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/refreshTokens')
      .send({
        refreshToken: authResponse.tokens.refreshToken,
      });

    expect(res.statusCode).toEqual(HttpStatus.OK);
    expect(res.body.tokens).toBeDefined();
  });
});
