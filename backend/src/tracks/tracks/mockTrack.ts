import { Track } from '@prisma/client';

export const mockTrack = (): Track => {
  return {
    id: 1,
    createdAt: new Date(),
    deletedAt: new Date(),
    description: 'Test description',
    hiddenDescription: '',
    keywords: [],
    private: false,
    title: 'Test title',
    updatedAt: new Date(),
    userId: undefined,
  };
};
