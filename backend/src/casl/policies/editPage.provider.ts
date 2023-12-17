import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { RequestWithPage } from '../../pages/types/requestWithPage';
import { Page } from '@prisma/client';
import { EditPageHandler } from './editPage.handler';

export const EditPageProvider: Provider = {
  provide: EditPageHandler,
  inject: [REQUEST],
  useFactory: (request: RequestWithPage) => {
    const page: Page = request.page;
    return new EditPageHandler(page);
  },
};
