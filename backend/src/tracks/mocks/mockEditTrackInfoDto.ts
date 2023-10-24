import { EditTrackInfoDto } from '../dtos/editTrackInfo.dto';

export const mockEditTrackInfoDto = (): EditTrackInfoDto => {
  return {
    title: 'My song',
    description: 'My awesome song',
    hiddenDescription: 'My awesome song info',
    private: false,
  };
};
