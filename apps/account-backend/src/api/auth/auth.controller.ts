import {
  Body,
  Controller,
  Get,
  Ip,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDto } from 'src/common/dto/auth/register.dto';
import { UserLoginDto } from 'src/common/dto/auth/login.dto';
import type { Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.gaurd';
import { User } from 'src/common/decorator/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: UserRegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: UserLoginDto,
    @Ip() ip: string,
    @Res() res: Response,
  ) {
    const user = await this.authService.validateUser(loginDto);
    const { access_token, expires_in } =
      await this.authService.generateAccessToken(user);
    const { refresh_token, refresh_token_expires_in } =
      await this.authService.generateRefreshToken(
        user,
        loginDto.device as string,
        ip,
      );
    res.setHeader(
      'Authorization',
      'Bearer ' + [access_token, refresh_token].toString(),
    );
    res.cookie('sid', access_token, { httpOnly: true });
    res.cookie('rid', refresh_token, {
      httpOnly: true,
    });
    return {
      access_token,
      expires_in,
      refresh_token,
      refresh_token_expires_in,
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getSessionInfo(@User('id') userId: number) {
    return await this.authService.getSessionInfo(userId);
  }
}
