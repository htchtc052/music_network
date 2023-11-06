import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import RequestWithTrack from '../interfaces/requestWithTrack.interface';
import { TrackWithFile } from '../types/track.types';

export const CurrentTrack = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TrackWithFile => {
    const request = ctx.switchToHttp().getRequest<RequestWithTrack>();
    return request.track;
  },
);
