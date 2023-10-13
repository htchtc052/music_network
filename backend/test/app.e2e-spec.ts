import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from '../src/users/users.service';
import { IsFieldAlreadyExists } from '../src/users/validators/isFieldAlReadyExists';
import { useContainer } from 'class-validator';
import { faker } from '@faker-js/faker';
import { Genders } from '@prisma/client';
import { UserEntity } from '../src/users/entities/user.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let testUser: UserEntity;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UsersService, IsFieldAlreadyExists],
    }).compile();

    app = moduleFixture.createNestApplication();
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    await app.init();
  });

  beforeAll(async () => {
    testUser = new UserEntity({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      gender: Genders.MALE,
      createdAt: faker.date.past(),
      updatedAt: null,
    });
  });

  it('/auth/register (POST) - success', async () => {
    const res = await request(app.getHttpServer()).post('/auth/register').send({
      username: testUser.username,
      email: testUser.email,
      password: testUser.password,
      passwordConfirm: testUser.password,
    });

    expect(res.statusCode).toEqual(HttpStatus.CREATED);
    expect(res.body.user.email).toEqual(testUser.email);
  });

  it('/auth/register (POST) - error exists email', async () => {
    const res = await request(app.getHttpServer()).post('/auth/register').send({
      username: testUser.username,
      email: testUser.email,
      password: testUser.password,
      passwordConfirm: testUser.password,
    });

    expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.message[0]).toEqual('Email already exists');
  });

  it('/auth/login (POST) - success', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).toEqual(HttpStatus.OK);
    expect(res.body.user.email).toEqual(testUser.email);
  });

  it('/auth/login (POST) - not found login', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: faker.internet.email(),
      password: testUser.password,
    });

    expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.message).toEqual('User does not exist');
  });

  it('/auth/login (POST) - wrong password', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: testUser.email,
      password: faker.internet.password(),
    });

    expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(res.body.message).toEqual(`Password is incorrect`);
  });
});
