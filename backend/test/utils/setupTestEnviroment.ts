import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { UsersService } from '../../src/users/users.service';
import { IsEmailAlreadyExists } from '../../src/users/validators/is-email-already-exists.service';
import { UsersRepository } from '../../src/users/users.repository';

export async function setupTestEnviroment(): Promise<TestingModule> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
    providers: [UsersService, UsersRepository, IsEmailAlreadyExists],
  }).compile();

  return moduleFixture;
}
