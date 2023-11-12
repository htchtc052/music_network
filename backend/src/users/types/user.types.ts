import { Prisma, User } from '@prisma/client';

export type UserUpdateInput = Partial<User>;

export type UserUncheckedCreateInput = Prisma.UserUncheckedCreateInput;
