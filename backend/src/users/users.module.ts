import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { IsEmailAlreadyExists } from './validators/isEmailAlreadyExists.validator';
import { ConfigModule } from '@nestjs/config';
import { UsersRepository } from './users.repository';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [UsersService, UsersRepository, IsEmailAlreadyExists],
  exports: [UsersService],
})
export class UsersModule {}
