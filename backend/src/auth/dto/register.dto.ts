import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmailAllreadyExists } from '../../users/validators/isEmailAlreadyExists.validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { MinLengthCustom } from '../../commons/minLengthCustom.decorator';

export class RegisterDto {
  @ApiProperty({ example: 'john_doe', description: 'User name' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.USERNAME_NOT_EMPTY'),
  })
  username: string;

  @ApiProperty({ example: 'user@mail.com', description: 'User email' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.EMAIL_NOT_EMPTY'),
  })
  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL_INVALID') })
  @Validate(IsEmailAllreadyExists, {
    message: i18nValidationMessage('validation.EMAIL_BUSY'),
  })
  email: string;

  @ApiProperty({ example: 'Strong_password', description: 'User password' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.PASSWORD_NOT_EMPTY'),
  })
  @MinLengthCustom(4, {
    message: i18nValidationMessage('validation.PASSWORD_MIN', {
      count: 4,
    }),
  })
  password: string;
}
