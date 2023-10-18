import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';

@Module({
  imports: [],
  providers: [TokensService],
})
export class TokensModule {}
