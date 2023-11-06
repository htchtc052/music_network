import { Genders, User } from '@prisma/client';

export const userMock: User = {
  id: 1,
  email: 'Test@mail.com',
  username: 'Test name',
  password: 'q1230',
  firstName: 'Test first name',
  lastName: 'Test last name',
  gender: Genders.MALE,
} as User;
