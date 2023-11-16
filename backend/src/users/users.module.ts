import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { IsEmailAlreadyExists } from './validators/is-email-already-exists.service';
import { GetUserProfileMiddleware } from './middlewares/getUserProfile.middleware';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { TracksModule } from '../tracks/tracks.module';
import { JwtService } from '@nestjs/jwt';
import { TracksService } from '../tracks/tracks.service';
import { TracksRepository } from '../tracks/tracksRepository';
import { UsersRepository } from './users.repository';
import { TokensService } from '../tokens/tokens.service';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [ConfigModule, TracksModule, TokensModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    IsEmailAlreadyExists,
    JwtService,
    TracksService,
    TracksRepository,
    TokensService,
  ],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GetUserProfileMiddleware).forRoutes(UsersController);
  }
}
