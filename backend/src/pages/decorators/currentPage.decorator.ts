import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Page } from '@prisma/client';
import { RequestWithPage } from '../types/requestWithPage';

export const CurrentPage = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Page => {
    const request = ctx.switchToHttp().getRequest<RequestWithPage>();

    return request.page;
  },
);
