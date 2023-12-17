import { Page, PrismaClient, User } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

export const seed = async (): Promise<void> => {
  const hashedPassword = await argon2.hash('1230');

  const user1: User = await prisma.user.upsert({
    where: { email: 'alonecat@gmail.com' },
    update: {},
    create: {
      email: 'alonecat@gmail.com',
      username: 'Alonecat',
      firstName: 'Alex',
      lastName: 'Kotov',
      password: hashedPassword,
    },
  });

  const user2: User = await prisma.user.upsert({
    where: { email: 'koshka@gmail.com' },
    update: {},
    create: {
      email: 'koshka@gmail.com',
      username: 'Koshka',
      firstName: 'Vera',
      lastName: 'Koshkina',
      password: hashedPassword,
    },
  });

  await prisma.user.upsert({
    where: { email: 'ruslanka@gmail.com' },
    update: {},
    create: {
      email: 'ruslanka@gmail.com',
      username: 'Ruslanka (hidden)',
      firstName: 'Ruslanka',
      lastName: 'Lebedeva',
      password: hashedPassword,
    },
  });

  const page1: Page = await prisma.page.upsert({
    where: { slug: 'page1' },
    update: {},
    create: {
      userId: user1.id,
      title: 'page1 title',
      description: 'page1 description',
      slug: 'page_slug_1',
    },
  });

  await prisma.page.upsert({
    where: { slug: 'page2' },
    update: {},
    create: {
      userId: user1.id,
      title: 'page2 title',
      description: 'page2 description',
      slug: 'page_slug_2',
    },
  });

  await prisma.page.upsert({
    where: { slug: 'page3' },
    update: {},
    create: {
      userId: user2.id,
      title: 'page3 title',
      description: 'page3 description',
      slug: 'page_slug_3',
    },
  });

  const trackId1 = 1;

  await prisma.trackFile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      filePath: '/path/file1',
      fileSize: 1024,
      mimetype: 'audio/mpeg',
      trackId: trackId1,
    },
  });

  await prisma.track.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: user1.id,
      pageId: 1,
      title: 'track 1 title',
      description: 'page1 description',
      hiddenDescription: 'page1 hidden description',
      private: false,
    },
  });
};

seed();
