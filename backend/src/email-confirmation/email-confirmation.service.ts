import { JwtParams } from '../tokens/types/JwtParams.type';
import { User } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TokensService } from '../tokens/tokens.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
    private emailService: EmailService,
  ) {}

  async sendEmailVerificationEmail(user: User): Promise<void> {
    try {
      const verificationToken =
        await this.tokensService.signEmailVerificationToken(user.id);

      await this.emailService.sendEmailVerificationEmail(
        user,
        verificationToken,
      );
    } catch (err) {
      console.error(`Error send activation email ${err.stack}`);
    }
  }

  async resendEmailConfirmationLink(user: User) {
    if (user.emailConfirmedAt) {
      throw new BadRequestException('Email already confirmed');
    }

    await this.sendEmailVerificationEmail(user);
  }

  async confirmEmail(token: string) {
    const payload: JwtParams =
      await this.tokensService.decodeJwtEmailVerificationToken(token);

    const user: User = await this.usersService.getUserById(+payload.sub);

    if (user.emailConfirmedAt) {
      throw new BadRequestException('Email already confirmed');
    }

    await this.usersService.markEmailAsConfirmed(user.id);
  }
}
