import { UserEntity } from '../entities/user.entity';
import { faker } from '@faker-js/faker';
import { Genders } from '@prisma/client';

export const mockUserEntity = (): UserEntity => {
  return {
    id: faker.number.int(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    createdAt: faker.date.past(),
    updatedAt: null,
    gender: Genders.MALE,
    isAdmin: false,
    ativatedAt: faker.date.past(),
    activationToken: null,
  };
};
