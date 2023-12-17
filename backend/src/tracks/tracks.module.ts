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
import { UsersModule } from '../users/users.module';
import { PagesService } from '../pages/pages.service';
import { PagesRepository } from '../pages/pages.repository';

@Module({
  imports: [FilesModule, UsersModule],
  controllers: [TracksController],
  providers: [TracksService, TracksRepository, PagesService, PagesRepository],
})
export class TracksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GetTrackMiddleware)
      .exclude({ path: 'tracks', method: RequestMethod.POST })
      .forRoutes(TracksController);
  }
}
