import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from '../src/users/users.service';
import { IsFieldAlreadyExists } from '../src/users/validators/isFieldAlReadyExists';
import { useContainer } from 'class-validator';
import { AuthService } from '../src/auth/auth.service';
import { RegisterDto } from '../src/auth/dto/register.dto';
import { LoginDto } from '../src/auth/dto/login.dto';
import { AuthResponse } from '../src/auth/responses/auth.response';
import { EditUserInfoDto } from '../src/account/dtos/editUserInfo.dto';
import { join } from 'path';
import { UserEntity } from '../src/users/entities/user.entity';
import { TrackEntity } from '../src/tracks/entities/track.entity';
import { EditTrackInfoDto } from '../src/tracks/dtos/editTrackInfo.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let authService: AuthService, usersService: UsersService;

  const credentialsValid: LoginDto = {
    email: 'test.user.1@mail.com',
    password: '1230',
  };

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
  describe('Auth routes', () => {
    describe('Register user', () => {
      const registerDto: RegisterDto = {
        email: credentialsValid.email,
        password: credentialsValid.password,
        username: 'Test user 1',
      };

      it('/auth/register (POST) - success', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/register')
          .send(registerDto);

        expect(res.statusCode).toEqual(HttpStatus.CREATED);

        expect(typeof res.body.tokens.accessToken).toBe('string');
        expect(typeof res.body.tokens.refreshToken).toBe('string');
        expect(res.body.user.email).toEqual(registerDto.email);
        expect(res.body.user.username).toEqual(registerDto.username);
      });

      it('/auth/register (POST) - error exists email', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/register')
          .send(registerDto);

        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.body.message[0]).toEqual('Email already exists');
      });
    });
    describe('Login user', () => {
      it('/auth/login (POST) - success', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send(credentialsValid);

        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(typeof res.body.tokens.accessToken).toBe('string');
        expect(typeof res.body.tokens.refreshToken).toBe('string');
        expect(res.body.user).toBeDefined();
      });

      it('/auth/login (POST) - not found login', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'not_exists@email.com',
            password: credentialsValid.password,
          });

        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.body.message).toEqual('User does not exist');
      });

      it('/auth/login (POST) - wrong password', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: credentialsValid.email,
            password: 'wrong_password',
          });

        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.body.message).toEqual(`Password is incorrect`);
      });
    });

    it('/auth/refreshToken (POST) - success', async () => {
      const authResponse: AuthResponse = await authService.login(
        credentialsValid,
      );

      const res = await request(app.getHttpServer())
        .post('/auth/refreshTokens')
        .send({
          refreshToken: authResponse.tokens.refreshToken,
        });

      expect(res.statusCode).toEqual(HttpStatus.OK);
      expect(res.body.tokens).toBeDefined();
    });
  });

  describe('Account routes with need auth as auth user', () => {
    let accessToken: string;
    beforeEach(async () => {
      const authResponse: AuthResponse = await authService.login(
        credentialsValid,
      );
      accessToken = authResponse.tokens.accessToken;
    });

    it('/auth/me (Get) - success', async () => {
      const res = await request(app.getHttpServer())
        .get('/account/me')
        .set('Authorization', 'Bearer ' + accessToken);

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
        .set('Authorization', 'Bearer ' + accessToken)
        .send(editUserInfoDto);

      expect(res.statusCode).toEqual(HttpStatus.OK);

      expect(res.body.user.username).toEqual(editUserInfoDto.username);
      expect(res.body.user.firstName).toEqual(editUserInfoDto.firstName);
      expect(res.body.user.lastName).toEqual(editUserInfoDto.lastName);
    });
  });

  describe('Account routes with need auth as unauthorized', () => {
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

  describe('User public route', () => {
    it('/users/:id (Get) - success', async () => {
      const userId = 1;
      const res = await request(app.getHttpServer()).get('/users/' + userId);

      expect(res.statusCode).toEqual(HttpStatus.OK);
      expect(res.body.user.id).toEqual(userId);
    });
  });

  describe('User tracks routes', () => {
    let accessToken: string;
    let authUser: UserEntity;
    beforeEach(async () => {
      const authResponse: AuthResponse = await authService.login(
        credentialsValid,
      );
      accessToken = authResponse.tokens.accessToken;
      authUser = authResponse.user;
    });

    let track: TrackEntity;

    describe('Create track', () => {
      it('/tracks (POST) - success', async () => {
        const fileName = 'test_song.mp3';
        const filePath = join(__dirname, 'fixtures', fileName);

        const res = await request(app.getHttpServer())
          .post('/tracks')
          .set('Authorization', 'Bearer ' + accessToken)
          .attach('trackFile', filePath);

        expect(res.statusCode).toEqual(HttpStatus.CREATED);

        expect(res.body.userId).toEqual(authUser.id);
        expect(res.body.title).toEqual(fileName);

        track = res.body;
      });

      it('/tracks (POST) - error: invalid file type', async () => {
        const fileName = 'test_image.jpg';
        const filePath = join(__dirname, 'fixtures', fileName);

        const res = await request(app.getHttpServer())
          .post('/tracks')
          .set('Authorization', 'Bearer ' + accessToken)
          .attach('trackFile', filePath);

        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.body.message).toEqual('File must be an mp3');
      });
    });

    describe('Track routes as owner', () => {
      it('/tracks/:id/editInfo (PUT) - success', async () => {
        const editTrackInfoDto: EditTrackInfoDto = {
          title: 'Track 1 title',
          description: 'Track 1 description',
          hiddenDescription: 'Track 1 hidden description',
          private: false,
        };

        const res = await request(app.getHttpServer())
          .put('/tracks/' + track.id + '/editInfo')
          .set('Authorization', 'Bearer ' + accessToken)
          .send(editTrackInfoDto);

        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.body.title).toEqual(editTrackInfoDto.title);
        expect(res.body.description).toEqual(editTrackInfoDto.description);
        expect(res.body.hiddenDescription).toEqual(
          editTrackInfoDto.hiddenDescription,
        );
      });

      it('/tracks/:id (GET) - success', async () => {
        const res = await request(app.getHttpServer())
          .get('/tracks/' + track.id)
          .set('Authorization', 'Bearer ' + accessToken);

        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.body.id).toEqual(track.id);
        expect(typeof res.body.hiddenDescription).toBe('string');
      });
    });

    describe('Track route as guest. Not access to hidden description', () => {
      it('/tracks/:id (GET) - success', async () => {
        const res = await request(app.getHttpServer()).get(
          '/tracks/' + track.id,
        );

        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.body.id).toEqual(track.id);
        expect(typeof res.body.hiddenDescription).toBe('undefined');
      });
    });
  });
});
