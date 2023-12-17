import { PagesRepository } from './pages.repository';

import { Test, TestingModule } from '@nestjs/testing';
import { Page, User } from '@prisma/client';
import { PageResponse } from './dtos/page.response';
import { EditPageInfoDto } from './dtos/editPageInfo.dto';
import { PagesService } from './pages.service';
import { UsersService } from '../users/users.service';
import { AbilityFactory } from '../casl/ability.factory';

describe('PagesService', () => {
  let pagesService: PagesService;

  let mockPagesRepository: PagesRepository =
    jest.createMockFromModule<PagesRepository>('./pages.repository');

  let mockUsersService: UsersService = jest.createMockFromModule<UsersService>(
    '../users/users.service',
  );

  let mockAbilityFactory: AbilityFactory =
    jest.createMockFromModule<AbilityFactory>('../casl/ability.factory');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagesService,
        {
          provide: PagesRepository,
          useValue: mockPagesRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AbilityFactory,
          useValue: mockAbilityFactory,
        },
      ],
    }).compile();

    pagesService = module.get<PagesService>(PagesService);
  });

  it('should be defined', () => {
    expect(PagesService).toBeDefined();
  });

  it('should create a new page', async () => {
    const user: User = { id: 1 } as User;

    const pageMock: Page = {
      id: 1,
      userId: user.id,
      title: 'Test page',
      slug: 'test_page',
      description: 'Test page descr',
    } as Page;

    const pageResponseMock: PageResponse = new PageResponse(pageMock);

    pagesService.createPage = jest.fn().mockResolvedValue(pageMock);

    const pageResponse: PageResponse = await pagesService.createPage(
      user,
      pageMock,
    );

    expect(pageResponse).toEqual(pageResponseMock);
  });

  describe('editPageInfo', () => {
    it('Should update page info', async () => {
      const pageMock: Page = {
        id: 1,
        title: 'Page title',
        description: 'Page desc',
      } as Page;

      const editPageInfoDtoMock: EditPageInfoDto = {
        title: 'Edited title',
        description: 'Edited description',
      } as EditPageInfoDto;

      const editedPageMock: Page = {
        ...pageMock,
        ...editPageInfoDtoMock,
      } as Page;

      mockPagesRepository.updatePage = jest
        .fn()
        .mockResolvedValue(editedPageMock);

      const editedPageResponse: PageResponse = await pagesService.editPageInfo(
        pageMock,
        editPageInfoDtoMock,
      );

      expect(editedPageResponse).toEqual(new PageResponse(editedPageMock));
    });
  });

  describe('GetPagesByUser', () => {
    const ownerUser: User = { id: 1 } as User;

    const pagesResponseMock: PageResponse[] = [
      { id: 1, userId: ownerUser.id, title: 'page 1' } as Page,
      { id: 2, userId: ownerUser.id, title: 'page 2' } as Page,
    ];

    mockPagesRepository.getPagesByUser = jest
      .fn()
      .mockImplementation((ownerUser: User) => {
        return pagesResponseMock.filter(
          (page: PageResponse) => page.userId == ownerUser.id,
        );
      });

    it('should return pages for owner user', async () => {
      const pagesResponseDto: PageResponse[] =
        await pagesService.getPagesByUser(ownerUser);
      expect(pagesResponseDto.length).toEqual(2);
    });
  });

  describe('deletePage', () => {
    it('should mark page as deleted', async () => {
      const pageMock: Page = { id: 1 } as Page;
      const deletedAt = new Date();
      const deletedPageMock: Page = { ...pageMock, deletedAt } as Page;

      mockPagesRepository.updatePage = jest
        .fn()
        .mockResolvedValue(deletedPageMock);

      const deletedPage: Page = await pagesService.markPageDeleted(pageMock);

      expect(deletedPage).toEqual(deletedPageMock);
    });
  });
});
