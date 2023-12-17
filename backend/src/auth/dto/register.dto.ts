import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmailAlreadyExists } from '../../users/validators/isEmailAlreadyExists.validator';

export class RegisterDto {
  @ApiProperty({ example: 'john_doe', description: 'User name' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'user@mail.com', description: 'User email' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email invalid format' })
  @Validate(IsEmailAlreadyExists, { message: 'Email already exists' })
  email: string;

  @ApiProperty({ example: 'Strong_password', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
