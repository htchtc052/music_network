import { Track, TrackFile } from '@prisma/client';
import { EditTrackInfoDto } from '../dtos/editTrackInfo.dto';
import { TrackWithFile } from '../types/track.types';

export const uploadedTrackFileMock: Express.Multer.File = {
  originalname: 'test_track.mp3',
  size: 1024,
  path: '/pathtofile',
  buffer: undefined,
  filename: 'test_str.mp3',
  destination: '/dest_folder',
  stream: undefined,
  mimetype: 'audio/mpeg',
} as Express.Multer.File;

export const trackMock: Track = {
  id: 1,
  title: 'Test title',
  userId: undefined,
  description: 'Test descrtiption',
  hiddenDescription: 'Test hidden description',
  private: false,
} as Track;

export const trackFileMock: TrackFile = {
  id: 1,
  filePath: '/path',
  fileSize: 1024,
  mimetype: 'audio/mpeg',
  trackId: undefined,
} as TrackFile;

export const trackWithFileMock: TrackWithFile = {
  ...trackMock,
  file: trackFileMock,
};

export const editTrackInfoDtoMock: EditTrackInfoDto = {
  description: 'Edited description',
  hiddenDescription: 'Edited hidden description',
  private: true,
  title: 'Edited title',
} as EditTrackInfoDto;
