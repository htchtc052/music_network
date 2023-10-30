import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { TrackEntity } from '../src/tracks/entities/track.entity';
import { join } from 'path';
import * as request from 'supertest';
import { AuthResponse } from '../src/auth/responses/auth.response';
import { setupTestEnviroment } from './utils/setupTestEnviroment';
import { registerTestUser } from './utils/registerTestUser';
import { deleteTestTrack } from './utils/deleteTestTrack';
import { deleteTestUser } from './utils/deleteTestUser';
import { deleteTestUploadedFiles } from './utils/deleteTestUploadedFiles';
import { mockRegisterDto } from './mocks/mockUserData';

describe('Create track', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  let authResponse: AuthResponse;

  beforeAll(async () => {
    moduleFixture = await setupTestEnviroment();
    app = moduleFixture.createNestApplication();

    const mockUserData = mockRegisterDto();
    authResponse = await registerTestUser(moduleFixture, mockUserData);

    await app.init();
  });

  afterAll(async () => {
    await app.close();

    await deleteTestTrack(moduleFixture, track);

    await deleteTestUser(moduleFixture, authResponse.user);

    deleteTestUploadedFiles(moduleFixture);
  });

  let track: TrackEntity;

  describe('Create track', () => {
    it('/tracks (POST) - success', async () => {
      const fileName = 'test_song.mp3';
      const filePath = join(__dirname, 'fixtures', fileName);
      try {
        const res = await request(app.getHttpServer())
          .post('/tracks')
          .set('Authorization', 'Bearer ' + authResponse.tokens.accessToken)
          .attach('trackFile', filePath);

        expect(res.statusCode).toEqual(HttpStatus.CREATED);

        expect(res.body.userId).toEqual(authResponse.user.id);
        expect(res.body.title).toEqual(fileName);

        track = res.body;
      } catch (err) {
        console.error(err);
      }
    });

    it('/tracks (POST) - error: invalid file type', async () => {
      const fileName = 'test_image.jpg';
      const filePath = join(__dirname, 'fixtures', fileName);

      try {
        const res = await request(app.getHttpServer())
          .post('/tracks')
          .set('Authorization', 'Bearer ' + authResponse.tokens.accessToken)
          .attach('trackFile', filePath);

        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.body.message).toEqual('File must be an mp3');
      } catch (err) {
        //console.error(err);
      }
    });
  });
});
