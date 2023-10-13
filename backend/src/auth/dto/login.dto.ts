import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email invalid format' })
  email: string;
  @IsNotEmpty()
  password: string;
}
