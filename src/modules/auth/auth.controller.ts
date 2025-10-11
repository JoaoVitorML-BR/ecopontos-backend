import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) { }

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
  @ApiResponse({ status: 409, description: 'Email já está em uso.' })
  async register(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('register-enterprise')
  @ApiOperation({ summary: 'Registrar empresa (apenas admin)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Empresa registrada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async registerEnterprise(@Body() registerDto: CreateUserDto) {
    const userData = { ...registerDto, role: 'enterprise', approved: true };
    return this.authService.registerEnterprise(userData);
  }

  @Post('register-admin')
  @ApiOperation({ summary: 'Registrar admin (apenas admin)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Admin registrado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async registerAdmin(@Body() registerDto: CreateUserDto) {
    const userData = {
      ...registerDto,
      role: 'admin',
    };
    return this.authService.registerUserByAdmin(userData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('check-first-user')
  @ApiOperation({ summary: 'Verifica se existe algum usuário cadastrado' })
  @ApiResponse({ status: 200, description: 'Retorna se é o primeiro usuário.' })
  async checkFirstUser() {
    const userCount = await this.usersService.countUsers();
    return { isFirstUser: userCount === 0 };
  }
}
