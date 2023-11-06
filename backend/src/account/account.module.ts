import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AccountController } from './account.controller';

import { AuthModule } from '../auth/auth.module';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AccountController],

  providers: [UsersService, UsersRepository],
})
export class AccountModule {}
