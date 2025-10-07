import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const isAuth = req.user;
    if (!isAuth || (isAuth.userId !== id && isAuth.role !== 'admin')) {
      throw new ForbiddenException('Você não tem permissão para acessar este usuário.');
    }
    const user = await this.usersService.findById(id);
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('name/:name')
  async findByName(@Param('name') name: string, @Req() req) {
    const isAuth = req.user;
    if (!isAuth || (isAuth.role !== 'admin')) {
      throw new ForbiddenException('Você não tem permissão para acessar este usuário.');
    }
    const user = await this.usersService.findByName(name);
    if (!user) {
      return { message: 'Usuário não encontrado' };
    }
    return {
      id: user._id.toString(),
      name: user.name
    };
  }

  @Get('validate/:id')
  async validateUser(@Param('id') id: string) {
    const isValid = await this.usersService.validateUser(id);
    return {
      userId: id,
      isValid,
      message: isValid ? 'Usuário válido' : 'Usuário não encontrado'
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Req() req) {
    const user = req.user;
    if (user.userId !== id && user.role !== 'admin') {
      throw new ForbiddenException('Você não tem permissão para deletar este usuário.');
    }

    await this.usersService.remove(id);
    return { message: 'Usuário excluído com sucesso' };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: UpdateUserDto,
    @Req() req
  ) {
    const user = req.user;
    if (user.userId !== id && user.role !== 'admin') {
      throw new ForbiddenException('Você não tem permissão para atualizar este usuário.');
    }
    const updatedUser = await this.usersService.update(id, updateData);
    return {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('role/admin')
  async getAdmins() {
    return this.usersService.findByRole('admin');
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('role/user')
  async getClients() {
    return this.usersService.findByRole('user');
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('role/enterprise')
  async getEnterprises() {
    return this.usersService.findByRole('enterprise');
  }
}