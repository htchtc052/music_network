import { PrismaService } from 'nestjs-prisma';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let accountService: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService, PrismaService],
    }).compile();

    accountService = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(accountService).toBeDefined();
  });
});
