import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from '../src/users/users.service';
import { IsFieldAlreadyExists } from '../src/users/validators/isFieldAlReadyExists';
import { useContainer } from 'class-validator';
import { faker } from '@faker-js/faker';
import { AuthService } from '../src/auth/auth.service';
import { AuthResponse } from '../src/auth/responses/auth.response';
import { EditUserInfoDto } from '../src/account/dtos/editUserInfo.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let authService, usersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UsersService, IsFieldAlreadyExists],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    await app.init();
    authService = moduleFixture.get<AuthService>(AuthService);
    usersService = moduleFixture.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await app.close();
  });

  let email = faker.internet.email();
  let password = faker.internet.password();

  describe('Auth routes', () => {
    it('/auth/register (POST) - success', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: faker.internet.userName(),
          email,
          password,
        });

      expect(res.statusCode).toEqual(HttpStatus.CREATED);
      expect(res.body.tokens).toBeDefined();
      expect(res.body.user.email).toEqual(email);
    });

    it('/auth/register (POST) - error exists email', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: faker.internet.userName(),
          email,
          password: faker.internet.password(),
        });

      expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(res.body.message[0]).toEqual('Email already exists');
    });

    it('/auth/login (POST) - success', async () => {
      const res = await request(app.getHttpServer()).post('/auth/login').send({
        email,
        password,
      });

      expect(res.statusCode).toEqual(HttpStatus.OK);
      expect(res.body.tokens).toBeDefined();
      expect(res.body.user.email).toEqual(email);
    });

    it('/auth/login (POST) - not found login', async () => {
      const res = await request(app.getHttpServer()).post('/auth/login').send({
        email: faker.internet.email(),
        password,
      });

      expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(res.body.message).toEqual('User does not exist');
    });

    it('/auth/login (POST) - wrong password', async () => {
      const res = await request(app.getHttpServer()).post('/auth/login').send({
        email,
        password: faker.internet.password(),
      });

      expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(res.body.message).toEqual(`Password is incorrect`);
    });

    it('/auth/refreshToken (POST) - success', async () => {
      const authResponse: AuthResponse = await authService.login({
        email,
        password,
      });

      const res = await request(app.getHttpServer())
        .post('/auth/refreshTokens')
        .send({
          refreshToken: authResponse.tokens.refreshToken,
        });

      expect(res.statusCode).toEqual(HttpStatus.OK);
      expect(res.body.tokens).toBeDefined();
    });
  });

  describe('Account routes with authorized user', () => {
    let accessToken: string;
    beforeEach(async () => {
      const authResponse: AuthResponse = await authService.login({
        email,
        password,
      });
      accessToken = authResponse.tokens.accessToken;
    });

    it('/auth/me (Get) - success', async () => {
      const res = await request(app.getHttpServer())
        .get('/account/me')
        .set('Authorization', 'Bearer ' + accessToken);

      expect(res.statusCode).toEqual(HttpStatus.OK);
      expect(res.body.user.email).toEqual(email);
    });

    it('/auth/me (Get) - wrong access token', async () => {
      const res = await request(app.getHttpServer())
        .get('/account/me')
        .set('Authorization', 'Bearer ' + faker.string.sample(5));

      expect(res.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it('/account/editInfo (PUT) - success', async () => {
      const username = faker.internet.userName();
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      const res = await request(app.getHttpServer())
        .put('/account/editInfo')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ firstName, lastName, username } as EditUserInfoDto);

      expect(res.statusCode).toEqual(HttpStatus.OK);

      expect(res.body.user.username).toEqual(username);
      expect(res.body.user.firstName).toEqual(firstName);
      expect(res.body.user.lastName).toEqual(lastName);
    });
  });

  describe('Account routes with no auth', () => {
    it('/auth/me (Get) - success', async () => {
      const res = await request(app.getHttpServer()).get('/account/me');
      expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
    });

    it('/account/editInfo (PUT) - success', async () => {
      const res = await request(app.getHttpServer()).put('/account/editInfo');
      expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
    });
  });
});
