import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthUser } from './decorators/authUser.decorator';
import { User } from '@prisma/client';
import { AuthResponse } from './dto/authResponse';
import { UserResponse } from '../users/dtos/userResponse';
import { SerializerInterceptor } from '../commons/serializerInterceptor';
import { TokensResponse } from '../tokens/dtos/tokensResponse';
import { RefreshTokensDto } from './dto/refreshTokens.dto';

@Controller('auth')
//@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Create user' })
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @UseInterceptors(SerializerInterceptor)
  register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  //
  @ApiOperation({ summary: 'Sign in user' })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseInterceptors(SerializerInterceptor)
  login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refreshTokens')
  refreshTokens(
    @Body() refreshTokensDto: RefreshTokensDto,
  ): Promise<TokensResponse> {
    return this.authService.refreshTokens(refreshTokensDto.refreshToken);
  }

  @ApiOperation({ summary: 'Get own user' })
  @HttpCode(HttpStatus.OK)
  @Get('/me')
  @UseInterceptors(SerializerInterceptor)
  async getUser(@AuthUser() authUser: User): Promise<UserResponse> {
    return new UserResponse(authUser);
  }
}
