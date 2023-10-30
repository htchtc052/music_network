import { TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { User } from '@prisma/client';

export const deleteTestUser = async (
  moduleFixture: TestingModule,
  user: User,
): Promise<void> => {
  const prismaService = moduleFixture.get<PrismaService>(PrismaService);
  await prismaService.user.deleteMany({
    where: { id: user.id },
  });
};
