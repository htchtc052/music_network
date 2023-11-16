import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { UsersService } from '../../users/users.service';
import { RequestWithAuthUser } from '../../users/types/requestsWithUsers.type';
import { AbilityFactory } from '../../casl/ability.factory';
import { TokensService } from '../../tokens/tokens.service';
import { JwtParams } from '../../tokens/types/JwtParams.type';

@Injectable()
export class JwtAuthGuard {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokensService: TokensService,
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuthUser>();
    const accessToken = this.extractTokenFromHeader(request);

    //console.log(`Accessing route: ${request.route.path} accessToken=${accessToken}`);

    const isPublic: boolean = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    if (!accessToken && !isPublic) {
      throw new ForbiddenException('Auth required');
    }

    let user: User;

    if (accessToken) {
      const accessTokenPayload: JwtParams =
        await this.tokensService.decodeJwtAccessToken(accessToken);
      // Case 3: The client has a valid accessToken
      user = await this.userService.getUserById(+accessTokenPayload.sub);
    }

    request.authUser = user;

    request.authUserAbility = this.abilityFactory.createForUser(
      request.authUser,
    );

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
