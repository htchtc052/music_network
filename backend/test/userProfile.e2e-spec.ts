import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { appSetup } from './utils/app.setup';
import * as request from 'supertest';
import { mockRegisterDto } from './mocks/mockUserData';
import { AuthResponse } from '../src/auth/responses/auth.response';
import { setupTestEnviroment } from './utils/setupTestEnviroment';
import { registerTestUser } from './utils/registerTestUser';
import { deleteTestUser } from './utils/deleteTestUser';

describe('User public route', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  let authResponse: AuthResponse;
  beforeAll(async () => {
    moduleFixture = await setupTestEnviroment();
    app = moduleFixture.createNestApplication();

    const mockUserData = mockRegisterDto();
    authResponse = await registerTestUser(moduleFixture, mockUserData);
    appSetup(app);

    await app.init();
  });

  afterAll(async () => {
    await deleteTestUser(moduleFixture, authResponse.user);
  });

  it('/users/:id (Get) - success', async () => {
    const res = await request(app.getHttpServer()).get(
      '/users/' + authResponse.user.id,
    );

    expect(res.statusCode).toEqual(HttpStatus.OK);
    expect(res.body.user).toBeDefined();
  });
});
