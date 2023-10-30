import { Track, User } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const createMockTrack = (user: User, isPrivate: boolean): Track => {
  return {
    id: faker.number.int(),
    createdAt: new Date(),
    deletedAt: null,
    description: faker.lorem.text(),
    hiddenDescription: faker.lorem.text(),
    keywords: [faker.word.sample(), faker.word.sample()],
    private: isPrivate,
    title: faker.word.sample(),
    updatedAt: null,
    userId: user.id,
  };
};
