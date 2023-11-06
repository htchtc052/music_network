import { User } from '@prisma/client';
import { RegisterDto } from '../../src/auth/dto/register.dto';
import * as argon2 from 'argon2';

export const createMockUser = async (
  registerDto: RegisterDto,
): Promise<User> => {
  const password = await argon2.hash(registerDto.password);
  return {
    activationToken: '',
    ativatedAt: undefined,
    createdAt: undefined,
    email: '',
    firstName: '',
    gender: undefined,
    id: 0,
    isAdmin: false,
    lastName: '',
    password,
    updatedAt: null,
    username: registerDto.username,
  };
};
