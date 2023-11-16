import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestingModule } from '@nestjs/testing';
import { appSetup } from './utils/app.setup';
import { AuthResponse } from '../src/auth/dto/authResponse';
import { RegisterDto } from '../src/auth/dto/register.dto';
import { EditUserInfoDto } from '../src/account/dtos/editUserInfo.dto';
import { Genders } from '@prisma/client';
import { createTestingModule } from './utils/createTestingModule';

describe('Auth routes', () => {
  let app: INestApplication;

  class MockMailerService {}

  beforeAll(async () => {
    const moduleFixture: TestingModule = await createTestingModule();

    app = moduleFixture.createNestApplication();
    appSetup(app);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let authUser: AuthResponse;

  const authUserData: RegisterDto = {
    email: 'auth.user@email.com',
    password: 'q1230',
    username: 'Auth user',
  } as RegisterDto;

  it('/auth/register (POST) - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(authUserData);

    expect(res.statusCode).toEqual(HttpStatus.CREATED);
    authUser = res.body;
  });

  it('/auth/register (POST) - error exists email', async () => {
    const res = await request(app.getHttpServer()).post('/auth/register').send({
      email: authUserData.email,
      password: 'password_string',
      username: 'New user name',
    });

    expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.message[0]).toEqual('Email already exists');
  });

  it('/auth/login (POST) - success', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: authUserData.email,
      password: authUserData.password,
    });

    expect(res.statusCode).toEqual(HttpStatus.OK);
  });

  it('/auth/login (POST) - not found login', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'not_exists@email.com',
      password: 'any_password',
    });

    expect(res.statusCode).toEqual(HttpStatus.NOT_FOUND);
  });

  it('/auth/login (POST) - wrong password', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: authUserData.email,
      password: 'wrong_password',
    });

    expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('/auth/refreshToken (POST) - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/refreshTokens')
      .send({
        refreshToken: authUser.refreshToken,
      });

    expect(res.statusCode).toEqual(HttpStatus.OK);
    expect(res.body.refreshToken).toBeDefined();
  });

  it('/auth/me (Get) - success', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer ' + authUser.accessToken);

    expect(res.statusCode).toEqual(HttpStatus.OK);
    expect(res.body.id).toBeDefined();
  });

  it('/auth/me (Get) - wrong token', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer wrong token');

    expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('/auth/me (Get) - guest not allowed', async () => {
    const res = await request(app.getHttpServer()).get('/auth/me');
    expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
  });

  it('/account/editInfo (PUT) - edit user success', async () => {
    const editUserInfoDto: EditUserInfoDto = {
      firstName: 'Alex',
      lastName: 'Logov',
      username: 'Alonecat',
      gender: Genders.MALE,
    } as EditUserInfoDto;

    const res = await request(app.getHttpServer())
      .put('/account/editUserInfo')
      .set('Authorization', 'Bearer ' + authUser.accessToken)
      .send(editUserInfoDto);

    expect(res.statusCode).toEqual(HttpStatus.OK);
  });

  it('/account/editUserInfo (Get) - guest not allowed', async () => {
    const res = await request(app.getHttpServer()).put('/account/editUserInfo');
    expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
  });

  it('/users/:id (Get) - user public route', async () => {
    const res = await request(app.getHttpServer()).get(
      '/users/' + authUser.user.id,
    );
    expect(res.statusCode).toEqual(HttpStatus.OK);
  });
});
