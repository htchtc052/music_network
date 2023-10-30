import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { UsersService } from '../../src/users/users.service';
import { IsFieldAlreadyExists } from '../../src/users/validators/isFieldAlReadyExists';

export async function setupTestEnviroment(): Promise<TestingModule> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
    providers: [UsersService, IsFieldAlreadyExists],
  }).compile();

  return moduleFixture;
}
