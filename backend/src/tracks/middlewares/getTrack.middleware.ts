import { Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Response } from 'express';
import RequestWithTrack from '../interfaces/requestWithTrack.interface';
import { TracksService } from '../tracks.service';

@Injectable()
export class GetTrackMiddleware implements NestMiddleware {
  constructor(private readonly tracksService: TracksService) {}

  async use(req: RequestWithTrack, res: Response, next: NextFunction) {
    req.track = await this.tracksService.getTrackById(parseInt(req.params.id));
    next();
  }
}
