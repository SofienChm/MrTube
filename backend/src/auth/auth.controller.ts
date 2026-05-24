import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
  ) {
    const data = await this.auth.register(email, password, name);
    return { success: true, data };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const data = await this.auth.login(email, password);
    return { success: true, data };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the currently authenticated user' })
  async me(@Req() req: any) {
    const user = await this.auth.findById(req.user.id);
    return { success: true, data: user };
  }
}
