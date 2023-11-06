import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GetTrackMiddleware } from './middlewares/getTrack.middleware';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { FilesModule } from '../files/files.module';
import { TracksRepository } from './tracksRepository';

@Module({
  imports: [FilesModule],
  controllers: [TracksController],
  providers: [TracksService, TracksRepository],
})
export class TracksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GetTrackMiddleware)
      .exclude({ path: 'tracks', method: RequestMethod.POST })
      .forRoutes(TracksController);
  }
}
