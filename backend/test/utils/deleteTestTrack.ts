import { TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { Track } from '@prisma/client';

export const deleteTestTrack = async (
  moduleFixture: TestingModule,
  track: Track,
): Promise<void> => {
  const prismaService = moduleFixture.get<PrismaService>(PrismaService);
  await prismaService.trackFile.deleteMany({
    where: { id: track.id },
  });
  await prismaService.track.deleteMany({
    where: { id: track.id },
  });
};
