import { Track } from '@prisma/client';

export const mockTracks = (): Track[] => {
  return [
    {
      id: 1,
      userId: 1,
      private: false,
      deletedAt: null,
      keywords: null,
    },
    {
      id: 2,
      userId: 1,
      private: true,
      deletedAt: null,
    },
  ] as Track[];
};
