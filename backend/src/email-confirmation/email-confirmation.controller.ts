import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { EmailConfirmationService } from './email-confirmation.service';
import { Public } from '../auth/decorators/public.decorator';
import { ConfirmEmailDto } from './dtos/confirmEmail.dto';
import { AuthUser } from '../auth/decorators/authUser.decorator';
import { User } from '@prisma/client';

@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(private emailConfirmationService: EmailConfirmationService) {}

  @ApiOperation({ summary: 'Resend email confirmation link' })
  @HttpCode(HttpStatus.OK)
  @Post('resendEmailConfirmation')
  async resendConfirmationLink(@AuthUser() authUser: User) {
    await this.emailConfirmationService.resendEmailConfirmationLink(authUser);

    return `Link sended`;
  }

  @ApiOperation({ summary: 'Confirm email' })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('confirmEmail')
  async ConfirmEmail(
    @Body() confirmEmailDto: ConfirmEmailDto,
  ): Promise<string> {
    await this.emailConfirmationService.confirmEmail(confirmEmailDto.token);
    return 'Email confirm success';
  }
}
