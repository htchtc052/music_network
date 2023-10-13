import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsFieldAlreadyExists } from '../../users/validators/isFieldAlReadyExists';
import { Match } from '../../commons/match.decorator';

export class RegisterDto {
  @ApiProperty({ example: 'john_doe', description: 'User name' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'user@mail.com', description: 'User email' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email invalid format' })
  @Validate(IsFieldAlreadyExists, { message: 'Email already exists' })
  email: string;

  @ApiProperty({ example: 'Strong_password', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'Strong_password',
    description: 'User password confirm',
  })
  @IsNotEmpty()
  @Match(RegisterDto, (s: RegisterDto) => s.password, {
    message: 'Password confirm not match',
  })
  passwordConfirm: string;
}
