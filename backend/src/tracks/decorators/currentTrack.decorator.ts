import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Track } from '@prisma/client';
import RequestWithTrack from '../interfaces/requestWithTrack.interface';

export const CurrentTrack = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Track => {
    const request = ctx.switchToHttp().getRequest<RequestWithTrack>();
    return request.track;
  },
);
