import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { appSetup } from './utils/app.setup';
import * as request from 'supertest';
import { EditUserInfoDto } from '../src/account/dtos/editUserInfo.dto';
import { AuthResponse } from '../src/auth/responses/auth.response';
import { setupTestEnviroment } from './utils/setupTestEnviroment';
import { mockRegisterDto } from './mocks/mockUserData';
import { registerTestUser } from './utils/registerTestUser';
import { deleteTestUser } from './utils/deleteTestUser';

describe('Account routes', () => {
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
    await app.close();
  });

  it('/auth/me (Get) - success', async () => {
    const res = await request(app.getHttpServer())
      .get('/account/me')
      .set('Authorization', 'Bearer ' + authResponse.tokens.accessToken);

    expect(res.statusCode).toEqual(HttpStatus.OK);
    expect(res.body.user).toBeDefined();
  });

  it('/account/editInfo (PUT) - success', async () => {
    const editUserInfoDto: EditUserInfoDto = {
      firstName: 'Alex',
      lastName: 'Logov',
      username: 'Alonecat',
    };

    const res = await request(app.getHttpServer())
      .put('/account/editInfo')
      .set('Authorization', 'Bearer ' + authResponse.tokens.accessToken)
      .send(editUserInfoDto);

    expect(res.statusCode).toEqual(HttpStatus.OK);

    expect(res.body.user.username).toEqual(editUserInfoDto.username);
    expect(res.body.user.firstName).toEqual(editUserInfoDto.firstName);
    expect(res.body.user.lastName).toEqual(editUserInfoDto.lastName);
  });

  it('/account/me (Get) - no auth', async () => {
    const res = await request(app.getHttpServer()).get('/account/me');
    expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
  });

  it('/auth/me (Get) - wrong access token', async () => {
    const res = await request(app.getHttpServer())
      .get('/account/me')
      .set('Authorization', 'Bearer ' + 'wrong token');

    expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  });
});
