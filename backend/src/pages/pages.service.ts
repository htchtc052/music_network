import { Injectable, NotFoundException } from '@nestjs/common';
import { Page, User } from '@prisma/client';
import { PagesRepository } from './pages.repository';
import { PageResponse } from './dtos/page.response';
import { EditPageInfoDto } from './dtos/editPageInfo.dto';
import { CreatePageDto } from './dtos/createPage.dto';
import { AbilityFactory, Action, AppAbility } from '../casl/ability.factory';
import { subject } from '@casl/ability';

@Injectable()
export class PagesService {
  constructor(
    private pagesRepository: PagesRepository,
    private abilityFactory: AbilityFactory,
  ) {}

  async createPage(
    user: User,
    createPageDto: CreatePageDto,
  ): Promise<PageResponse> {
    const page: Page = await this.pagesRepository.createPage({
      userId: user.id,
      title: createPageDto.title,
      slug: createPageDto.slug,
      description: createPageDto.description,
    });

    return new PageResponse(page);
  }

  async getPageBySlug(slug: string): Promise<Page> {
    const page: Page = await this.pagesRepository.getPageBySlug(slug);

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async editPageInfo(
    page: Page,
    editPageInfoDto: EditPageInfoDto,
  ): Promise<PageResponse> {
    const updatedPage: Page = await this.pagesRepository.updatePage(
      page.id,
      editPageInfoDto,
    );

    return new PageResponse(updatedPage);
  }

  async markPageDeleted(page: Page): Promise<Page> {
    const deletedPage: Page = (await this.pagesRepository.updatePage(page.id, {
      deletedAt: new Date(),
    })) as Page;

    return deletedPage;
  }

  async getPagesByUser(ownerUser: User): Promise<PageResponse[]> {
    const pages: Page[] = await this.pagesRepository.getPagesByUser(ownerUser);

    return pages.map((page: Page) => new PageResponse(page));
  }

  async checkPageSlugExists(slug: string): Promise<boolean> {
    return !(await this.pagesRepository.getPagesCountBySlug(slug));
  }

  canReadPrivateData(page: Page, guestUser: User): boolean {
    const ability: AppAbility = this.abilityFactory.createForUser(guestUser);
    return ability.can(Action.ReadPrivateData, subject('Page', page));
  }
}
