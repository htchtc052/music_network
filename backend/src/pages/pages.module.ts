import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PagesRepository } from './pages.repository';
import { PagesService } from './pages.service';
import { GetPageMiddleware } from './middlewares/getPage.middleware';
import { PagesController } from './pages.controller';
import { TracksModule } from '../tracks/tracks.module';
import { TracksRepository } from '../tracks/tracksRepository';
import { TracksService } from '../tracks/tracks.service';
import { IsPageSlugAlreadyExists } from './validators/IsPageSlugAlreadyExists';

@Module({
  imports: [UsersModule, TracksModule],
  controllers: [PagesController],
  providers: [
    PagesService,
    PagesRepository,
    TracksService,
    TracksRepository,
    IsPageSlugAlreadyExists,
  ],
})
export class PagesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GetPageMiddleware)
      .exclude({ path: 'pages', method: RequestMethod.POST })
      .forRoutes(PagesController);
  }
}
