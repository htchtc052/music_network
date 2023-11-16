import { userMock } from '../users/mocks/users.mocks';
import { JwtParams } from '../tokens/types/JwtParams.type';
import { emailVerificationTokenMock } from '../tokens/mocks/tokens.mocks';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { TokensService } from '../tokens/tokens.service';
import { EmailService } from '../email/email.service';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailConfirmationService } from './email-confirmation.service';

describe('AuthService', () => {
  let emailConfirmationService: EmailConfirmationService;

  const mockUsersService: UsersService = jest.createMockFromModule(
    '../users/users.service',
  );

  const mockTokensService: TokensService = jest.createMockFromModule(
    '../tokens/tokens.service',
  );

  const mockEmailService: EmailService = jest.createMockFromModule(
    '../email/email.service',
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailConfirmationService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: TokensService,
          useValue: mockTokensService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    emailConfirmationService = module.get<EmailConfirmationService>(
      EmailConfirmationService,
    );
  });

  it('should be defined', () => {
    expect(emailConfirmationService).toBeDefined();
  });

  it('should confirm email by email verification token', async () => {
    mockTokensService.decodeJwtEmailVerificationToken = jest
      .fn()
      .mockResolvedValue({
        sub: userMock.id.toString(),
      } as JwtParams);

    mockUsersService.getUserById = jest.fn().mockResolvedValue(userMock);

    mockUsersService.markEmailAsConfirmed = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    await emailConfirmationService.confirmEmail(emailVerificationTokenMock);

    expect(mockUsersService.getUserById).toHaveBeenCalledWith(userMock.id);

    expect(mockUsersService.markEmailAsConfirmed).toHaveBeenCalledWith(
      userMock.id,
    );
  });
});
