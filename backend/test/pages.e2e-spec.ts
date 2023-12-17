import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestingModule } from '@nestjs/testing';
import { appSetup } from './utils/app.setup';
import { AuthResponse } from '../src/auth/dto/authResponse';
import { ConfigService } from '@nestjs/config';
import { createTestingModule } from './utils/createTestingModule';
import { PageResponse } from '../src/pages/dtos/page.response';
import { CreatePageDto } from '../src/pages/dtos/createPage.dto';
import { EditPageInfoDto } from '../src/pages/dtos/editPageInfo.dto';

describe('Auth routes', () => {
  let app: INestApplication;
  let configService: ConfigService;

  let ownerUser: AuthResponse;
  let guestUser: AuthResponse;

  class MockMailerService {}

  beforeAll(async () => {
    const moduleFixture: TestingModule = await createTestingModule();

    app = moduleFixture.createNestApplication();
    appSetup(app);

    await app.init();

    const testSuiteName = `pages`;

    const resOwnerRegister = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `user.${testSuiteName}.1@mail.com`,
        password: `simple_pass`,
        username: `User ${testSuiteName} owner`,
      });

    ownerUser = resOwnerRegister.body;

    const resGuestRegister = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `user.${testSuiteName}.2@mail.com`,
        password: `simple_pass`,
        username: `User ${testSuiteName} guest`,
      });

    guestUser = resGuestRegister.body;

    configService = moduleFixture.get<ConfigService>(ConfigService);
  });

  afterAll(async () => {
    await app.close();
  });

  let page: PageResponse;

  const createPageDto: CreatePageDto = {
    title: 'Test page',
    slug: 'page_slug',
  } as CreatePageDto;

  it('/pages (POST) - create  page success', async () => {
    const res = await request(app.getHttpServer())
      .post('/pages')
      .set('Authorization', 'Bearer ' + ownerUser.accessToken)
      .send(createPageDto);
    page = res.body;

    expect(res.statusCode).toEqual(HttpStatus.CREATED);
  });

  it('/pages (POST) - create  page with exists slug error', async () => {
    const res = await request(app.getHttpServer())
      .post('/pages')
      .set('Authorization', 'Bearer ' + ownerUser.accessToken)
      .send({
        slug: createPageDto.slug,
        title: 'any title',
      });

    expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('/pages/editPageInfo (PUT) - edit page by owner success', async () => {
    const editPageInfoDto: EditPageInfoDto = {
      title: 'Edited title',
      description: 'Edited description',
    } as EditPageInfoDto;

    const res = await request(app.getHttpServer())
      .put('/pages/' + page.slug + '/editPageInfo')
      .set('Authorization', 'Bearer ' + ownerUser.accessToken)
      .send(editPageInfoDto);

    const editedPage: PageResponse = res.body;

    expect(editedPage.title).toEqual('Edited title');
    expect(editedPage.description).toEqual('Edited description');
    expect(res.statusCode).toEqual(HttpStatus.OK);
  });

  it('/pages/editPageInfo (PUT) - edit page by guest error', async () => {
    const editPageInfoDto: EditPageInfoDto = {
      title: 'Edited title',
      description: 'Edited description',
    } as EditPageInfoDto;

    const res = await request(app.getHttpServer())
      .put('/pages/' + page.slug + '/editPageInfo')
      .set('Authorization', 'Bearer ' + guestUser.accessToken)
      .send(editPageInfoDto);

    expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
  });

  it('/pages/:slug (Get) - get page', async () => {
    const res = await request(app.getHttpServer()).get('/pages/' + page.slug);
    expect(res.statusCode).toEqual(HttpStatus.OK);
  });

  it('/users/:id/pages (Get) - get user pages', async () => {
    const res = await request(app.getHttpServer()).get(
      '/users/' + ownerUser.user.id + '/pages',
    );
    expect(res.statusCode).toEqual(HttpStatus.OK);
    expect(res.body).toHaveLength(1);
  });

  it('/pages/deletePage (PUT) - delete page by owner success', async () => {
    const res = await request(app.getHttpServer())
      .delete('/pages/' + page.slug + '/deletePage')
      .set('Authorization', 'Bearer ' + ownerUser.accessToken);

    expect(res.statusCode).toEqual(HttpStatus.OK);
  });
});
