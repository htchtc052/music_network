import { Prisma } from '@prisma/client';

export type UserWhereFilter = Prisma.UserUpdateInput;

export type UserWithToken = Prisma.UserGetPayload<{
  include: { Token: true };
}>;

export type UserUpdateInput = Prisma.UserUpdateInput;

export type UserUncheckedCreateInput = Prisma.UserUncheckedCreateInput;
