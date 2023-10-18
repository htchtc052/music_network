import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokensService } from '../tokens/tokens.service';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [UsersModule, TokensModule],
  controllers: [AuthController],
  providers: [AuthService, TokensService],
})
export class AuthModule {}
