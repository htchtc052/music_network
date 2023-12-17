import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { PagesService } from '../pages.service';
import { Page } from '@prisma/client';
import { RequestWithPage } from '../types/requestWithPage';

@Injectable()
export class GetPageMiddleware implements NestMiddleware {
  constructor(private readonly pagesService: PagesService) {}

  async use(req: RequestWithPage, res: Response, next: NextFunction) {
    const page: Page = await this.pagesService.getPageBySlug(req.params.slug);

    req.page = page;
    next();
  }
}
