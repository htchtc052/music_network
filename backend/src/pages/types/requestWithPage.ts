import { RequestWithAuthUser } from '../../auth/types/requestWithAuthData.type';
import { Page } from '@prisma/client';

export type RequestWithPage = RequestWithAuthUser & {
  page: Page;
};
