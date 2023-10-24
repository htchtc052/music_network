import { RegisterDto } from '../dto/register.dto';

export const mockRegisterDto = (): RegisterDto => {
  return {
    email: 'test@mail.com',
    username: 'testuser',
    password: 'testpass',
  };
};
