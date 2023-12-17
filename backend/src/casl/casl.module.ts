import { Global, Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { UsersModule } from '../users/users.module';
import { ReadTrackHandler } from './policies/readTrack.handler';
import { ReadTrackProvider } from './policies/readTrack.provider';
import { TracksModule } from '../tracks/tracks.module';
import { EditTrackProvider } from './policies/editTrack.provider';
import { EditTrackHandler } from './policies/editTrack.handler';
import { EditPageProvider } from './policies/editPage.provider';
import { EditPageHandler } from './policies/editPage.handler';

@Global()
@Module({
  imports: [UsersModule, TracksModule],
  providers: [
    AbilityFactory,
    EditPageProvider,
    ReadTrackProvider,
    EditTrackProvider,
  ],
  exports: [
    AbilityFactory,
    EditPageHandler,
    ReadTrackHandler,
    EditTrackHandler,
  ],
})
export class CaslModule {}
