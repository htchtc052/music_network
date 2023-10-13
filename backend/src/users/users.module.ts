import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { IsFieldAlreadyExists } from './validators/isFieldAlReadyExists';
import { GetUserProfileMiddleware } from './middlewares/getUserProfile.middleware';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { TracksModule } from '../tracks/tracks.module';
import { JwtService } from '@nestjs/jwt';
import { TracksService } from '../tracks/tracks.service';

@Module({
  imports: [ConfigModule, TracksModule],
  controllers: [UsersController],
  providers: [UsersService, IsFieldAlreadyExists, JwtService, TracksService],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GetUserProfileMiddleware).forRoutes(UsersController);
  }
}
