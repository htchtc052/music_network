import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthResponse } from './responses/auth.response';
import { TokensResponse } from './responses/tokens.response';
import { Public } from './decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
//@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Create user' })
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  //
  @ApiOperation({ summary: 'Sign in user' })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refreshTokens')
  refreshTokens(@Req() req: Request): Promise<TokensResponse> {
    const refreshToken: string = req.body['refreshToken'];
    return this.authService.refreshTokens(refreshToken);
  }
}
