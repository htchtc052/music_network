import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AccountController } from './account.controller';

import { AuthModule } from '../auth/auth.module';
import { TokensModule } from '../tokens/tokens.module';
import { TokensService } from '../tokens/tokens.service';
import { UsersRepository } from '../users/users.repository';
import { EmailModule } from '../email/email.module';
import { PagesModule } from '../pages/pages.module';
import { PagesService } from '../pages/pages.service';
import { PagesRepository } from '../pages/pages.repository';

@Module({
  imports: [UsersModule, AuthModule, TokensModule, EmailModule, PagesModule],
  controllers: [AccountController],

  providers: [
    UsersService,
    TokensService,
    UsersRepository,
    PagesService,
    PagesRepository,
  ],
})
export class AccountModule {}
