import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { UsersModule } from '../users/users.module';
import { UsersRepository } from '../users/users.repository';
import { TokensRepository } from './tokens.repository';

@Module({
  imports: [UsersModule],
  providers: [TokensService, TokensRepository, UsersRepository],
})
export class TokensModule {}
