import { RegisterDto } from '../../src/auth/dto/register.dto';
import { faker } from '@faker-js/faker';

export const mockRegisterDto = (): RegisterDto => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    username: faker.internet.displayName(),
  };
};
