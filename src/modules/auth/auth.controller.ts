import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) { }

  @Post('register')
  async register(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('register-enterprise')
  async registerEnterprise(@Body() registerDto: CreateUserDto) {
    const userData = { ...registerDto, role: 'enterprise', approved: true };
    return this.authService.registerEnterprise(userData);
  }

  @Post('register-admin')
  async registerAdmin(@Body() registerDto: CreateUserDto) {
    const userData = {
      ...registerDto,
      role: 'admin',
    };
    return this.authService.registerUserByAdmin(userData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log(loginDto);
    return this.authService.login(loginDto);
  }

  @Get('check-first-user')
  async checkFirstUser() {
    const userCount = await this.usersService.countUsers();
    return { isFirstUser: userCount === 0 };
  }
}
