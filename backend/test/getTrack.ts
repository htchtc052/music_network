import { setupTestEnviroment } from './utils/setupTestEnviroment';
import { mockRegisterDto } from './mocks/mockUserData';
import { registerTestUser } from './utils/registerTestUser';
import { deleteTestTrack } from './utils/deleteTestTrack';
import { deleteTestUser } from './utils/deleteTestUser';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { AuthResponse } from '../src/auth/responses/auth.response';
import * as request from 'supertest';
import { createTestTrack } from './utils/createTestTrack';
import { TrackEntity } from '../src/tracks/entities/track.entity';

describe('Get Track', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let authResponse: AuthResponse;
  let track: TrackEntity;

  beforeAll(async () => {
    moduleFixture = await setupTestEnviroment();
    app = moduleFixture.createNestApplication();

    const mockUserData = mockRegisterDto();
    authResponse = await registerTestUser(moduleFixture, mockUserData);

    track = await createTestTrack(moduleFixture, authResponse.user, false);

    await app.init();
  });

  afterAll(async () => {
    await app.close();

    await deleteTestTrack(moduleFixture, track);

    await deleteTestUser(moduleFixture, authResponse.user);
  });

  it('/tracks/:id (GET) - success', async () => {
    const res = await request(app.getHttpServer())
      .get('/tracks/' + track.id)
      .set('Authorization', 'Bearer ' + authResponse.tokens.accessToken);

    expect(res.statusCode).toEqual(HttpStatus.OK);
    expect(res.body.id).toEqual(track.id);
  });
});
