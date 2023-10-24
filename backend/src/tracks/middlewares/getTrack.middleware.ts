import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';

import { NextFunction, Response } from 'express';
import { TracksService } from '../tracks.service';
import RequestWithTrack from '../interfaces/requestWithTrack.interface';
import { Track } from '@prisma/client';

@Injectable()
export class GetTrackMiddleware implements NestMiddleware {
  constructor(private readonly tracksService: TracksService) {}

  async use(req: RequestWithTrack, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);

    if (!id) {
      throw new NotFoundException(`Missing track id`);
    }
    const track: Track = await this.tracksService.findWithFileById(id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    req.track = track;
    next();
  }
}
