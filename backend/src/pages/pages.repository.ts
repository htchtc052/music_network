import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Page, Prisma, User } from '@prisma/client';

@Injectable()
export class PagesRepository {
  constructor(private prisma: PrismaService) {}

  async createPage(
    pageCreatedInput: Prisma.PageUncheckedCreateInput,
  ): Promise<Page> {
    return this.prisma.page.create({
      data: pageCreatedInput,
    });
  }

  async getPagesByCriteria(
    pageWhereFilter: Prisma.PageWhereInput,
  ): Promise<Page[]> {
    const pages: Page[] = await this.prisma.page.findMany({
      where: {
        ...pageWhereFilter,
        deletedAt: null,
      },
    });

    return pages;
  }

  async getPagesByUser(user: User): Promise<Page[]> {
    const where: Prisma.PageWhereInput = {
      userId: user.id,
      deletedAt: null,
    };

    return this.getPagesByCriteria(where);
  }

  async getPageBySlug(slug: string): Promise<Page> {
    return this.prisma.page.findUnique({
      where: {
        slug,
        deletedAt: null,
      },
    });
  }

  getPagesCountBySlug(slug: string): Prisma.PrismaPromise<number> {
    return this.prisma.page.count({
      where: {
        slug,
      },
    });
  }

  async updatePage(
    pageId: number,
    updatePageInput: Prisma.PageUpdateInput,
  ): Promise<Page> {
    return this.prisma.page.update({
      where: { id: pageId },
      data: updatePageInput,
    });
  }
}
