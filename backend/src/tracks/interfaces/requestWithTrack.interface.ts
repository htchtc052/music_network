import { Request } from 'express';
import { TrackWithFile } from '../types/track.types';

interface RequestWithTrack extends Request {
  track: TrackWithFile;
}

export default RequestWithTrack;
