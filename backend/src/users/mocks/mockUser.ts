import { Genders, User } from '@prisma/client';

export const mockUser = (): User => {
  return {
    id: 1,
    isAdmin: false,
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password',
    firstName: 'John',
    lastName: 'Doe',
    gender: Genders.MALE,
    activationToken: null,
    ativatedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
