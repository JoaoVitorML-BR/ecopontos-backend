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
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Usuários')
@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: 200, description: 'Lista de usuários.', schema: {
      example: [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@exemplo.com',
          role: 'user',
          createdAt: '2023-01-01T12:00:00Z',
          updatedAt: '2023-01-01T12:00:00Z'
        }
      ]
    }
  })
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
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200, description: 'Usuário encontrado.', schema: {
      example: {
        id: '1',
        name: 'João Silva',
        email: 'joao@exemplo.com',
        role: 'user',
        createdAt: '2023-01-01T12:00:00Z',
        updatedAt: '2023-01-01T12:00:00Z'
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Sem permissão para acessar este usuário.', schema: { example: { success: false, message: 'Você não tem permissão para acessar este usuário.' } } })
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
  @ApiOperation({ summary: 'Buscar usuário por nome (apenas admin)' })
  @ApiParam({ name: 'name', type: String })
  @ApiResponse({
    status: 200, description: 'Usuário encontrado.', schema: {
      example: {
        id: '1',
        name: 'João Silva'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.', schema: { example: { message: 'Usuário não encontrado' } } })
  @ApiResponse({ status: 403, description: 'Sem permissão para acessar este usuário.', schema: { example: { success: false, message: 'Você não tem permissão para acessar este usuário.' } } })
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
  @ApiOperation({ summary: 'Validar usuário por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200, description: 'Validação do usuário.', schema: {
      example: {
        userId: '1',
        isValid: true,
        message: 'Usuário válido'
      }
    }
  })
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
  @ApiOperation({ summary: 'Deletar usuário por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Usuário excluído com sucesso.', schema: { example: { message: 'Usuário excluído com sucesso' } } })
  @ApiResponse({ status: 403, description: 'Sem permissão para deletar este usuário.', schema: { example: { success: false, message: 'Você não tem permissão para deletar este usuário.' } } })
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
  @ApiOperation({ summary: 'Atualizar usuário por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      valid: {
        summary: 'Exemplo válido',
        value: {
          name: 'Novo Nome',
          email: 'novo@exemplo.com',
        },
      },
      invalid: {
        summary: 'Exemplo inválido',
        value: {
          name: '',
        },
      },
    },
  })
  @ApiResponse({
    status: 200, description: 'Usuário atualizado com sucesso.', schema: {
      example: {
        id: '1',
        name: 'Novo Nome',
        email: 'novo@exemplo.com',
        role: 'user',
        createdAt: '2023-01-01T12:00:00Z',
        updatedAt: '2023-01-01T12:00:00Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.', schema: { example: { success: false, message: 'Nome é obrigatório' } } })
  @ApiResponse({ status: 403, description: 'Sem permissão para atualizar este usuário.', schema: { example: { success: false, message: 'Você não tem permissão para atualizar este usuário.' } } })
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
  @ApiOperation({ summary: 'Listar todos os administradores' })
  @ApiResponse({
    status: 200, description: 'Lista de administradores.', schema: {
      example: [
        {
          id: '1',
          name: 'Admin',
          email: 'admin@exemplo.com',
          role: 'admin',
          createdAt: '2023-01-01T12:00:00Z',
          updatedAt: '2023-01-01T12:00:00Z'
        }
      ]
    }
  })
  async getAdmins() {
    return this.usersService.findByRole('admin');
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('role/user')
  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiResponse({
    status: 200, description: 'Lista de clientes.', schema: {
      example: [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@exemplo.com',
          role: 'user',
          createdAt: '2023-01-01T12:00:00Z',
          updatedAt: '2023-01-01T12:00:00Z'
        }
      ]
    }
  })
  async getClients() {
    return this.usersService.findByRole('user');
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('role/enterprise')
  @ApiOperation({ summary: 'Listar todas as empresas' })
  @ApiResponse({
    status: 200, description: 'Lista de empresas.', schema: {
      example: [
        {
          id: '1',
          name: 'Empresa X',
          email: 'empresa@exemplo.com',
          role: 'enterprise',
          createdAt: '2023-01-01T12:00:00Z',
          updatedAt: '2023-01-01T12:00:00Z'
        }
      ]
    }
  })
  async getEnterprises() {
    return this.usersService.findByRole('enterprise');
  }
}