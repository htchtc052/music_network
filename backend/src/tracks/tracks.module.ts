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
import { TokensModule } from '../tokens/tokens.module';
import { TokensService } from '../tokens/tokens.service';

@Module({
  imports: [FilesModule, TokensModule],
  controllers: [TracksController],
  providers: [TracksService, TracksRepository, TokensService],
})
export class TracksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GetTrackMiddleware)
      .exclude({ path: 'tracks', method: RequestMethod.POST })
      .forRoutes(TracksController);
  }
}
