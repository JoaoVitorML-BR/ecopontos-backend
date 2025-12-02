import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  ForbiddenException,
  Req
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { EcoPointsService } from './ecopoints.service';
import { CreateEcoPointDto } from './dto/create-ecopoint.dto';
import { UpdateEcoPointDto } from './dto/update-ecopoint.dto';
import { EcoPointResponseDto } from './dto/ecopoint-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// ...existing code...

@ApiTags('Ecopontos')
@Controller('ecopoints')
@UsePipes(new ValidationPipe({ transform: true }))
export class EcoPointsController {
  constructor(private readonly ecoPointsService: EcoPointsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Cadastrar novo ecoponto (apenas empresas)' })
  @ApiBody({
    type: CreateEcoPointDto,
    examples: {
      valid: {
        summary: 'Exemplo válido',
        value: {
          title: 'Ecoponto Central',
          cnpj: '12.345.678/0001-99',
          opening_hours: '08:00-18:00',
          interval: 'Semanal',
          accepted_materials: ['Plástico', 'Vidro'],
          address: 'Rua das Flores, 123',
          coordinates: '-9.741951520552348,-36.660397991379185',
        },
      },
      invalid: {
        summary: 'Exemplo inválido',
        value: {
          title: '',
          cnpj: '',
          opening_hours: '',
          interval: '',
          accepted_materials: [],
          address: '',
          coordinates: 'abc',
        },
      },
    },
  })
  @ApiResponse({
    status: 201, description: 'Ecoponto criado com sucesso.', schema: {
      example: {
        id: '1',
        companyId: 'empresa123',
        title: 'Ecoponto Central',
        cnpj: '12.345.678/0001-99',
        opening_hours: '08:00-18:00',
        interval: 'Semanal',
        accepted_materials: ['Plástico', 'Vidro'],
        address: 'Rua das Flores, 123',
        coordinates: '-9.741951520552348,-36.660397991379185',
        createdAt: '2023-01-01T12:00:00Z',
        updatedAt: '2023-01-01T12:00:00Z',
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.', schema: { example: { success: false, message: 'Título é obrigatório' } } })
  @ApiResponse({ status: 403, description: 'Apenas empresas podem cadastrar ecopontos.', schema: { example: { success: false, message: 'Apenas empresas podem cadastrar ecopontos.' } } })
  async create(@Body() createEcoPointDto: CreateEcoPointDto, @Req() req): Promise<EcoPointResponseDto> {
    const user = req.user;
    if (!user || user.role !== 'enterprise') {
      throw new ForbiddenException('Apenas empresas podem cadastrar ecopontos.');
    }
    return this.ecoPointsService.create({ ...createEcoPointDto, companyId: user.userId });
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os ecopontos' })
  @ApiResponse({
    status: 200, description: 'Lista de ecopontos.', schema: {
      example: [
        {
          id: '1',
          companyId: 'empresa123',
          title: 'Ecoponto Central',
          cnpj: '12.345.678/0001-99',
          opening_hours: '08:00-18:00',
          interval: 'Semanal',
          accepted_materials: ['Plástico', 'Vidro'],
          address: 'Rua das Flores, 123',
          coordinates: '-9.741951520552348,-36.660397991379185',
          createdAt: '2023-01-01T12:00:00Z',
          updatedAt: '2023-01-01T12:00:00Z',
        }
      ]
    }
  })
  async findAll(): Promise<EcoPointResponseDto[]> {
    return this.ecoPointsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar ecoponto por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200, description: 'Ecoponto encontrado.', schema: {
      example: {
        id: '1',
        companyId: 'empresa123',
        title: 'Ecoponto Central',
        cnpj: '12.345.678/0001-99',
        opening_hours: '08:00-18:00',
        interval: 'Semanal',
        accepted_materials: ['Plástico', 'Vidro'],
        address: 'Rua das Flores, 123',
        coordinates: '-9.741951520552348,-36.660397991379185',
        createdAt: '2023-01-01T12:00:00Z',
        updatedAt: '2023-01-01T12:00:00Z',
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Ecoponto não encontrado.', schema: { example: { success: false, message: 'Ecoponto não encontrado.' } } })
  async findOne(@Param('id') id: string): Promise<EcoPointResponseDto> {
    return this.ecoPointsService.findOne(id);
  }

  @Get('cnpj/:cnpj')
  @ApiOperation({ summary: 'Buscar ecopontos por CNPJ' })
  @ApiParam({ name: 'cnpj', type: String })
  @ApiResponse({
    status: 200, description: 'Lista de ecopontos encontrados.', schema: {
      example: [
        {
          id: '1',
          companyId: 'empresa123',
          title: 'Ecoponto Central',
          cnpj: '12.345.678/0001-99',
          opening_hours: '08:00-18:00',
          interval: 'Semanal',
          accepted_materials: ['Plástico', 'Vidro'],
          address: 'Rua das Flores, 123',
          coordinates: '-9.741951520552348,-36.660397991379185',
          createdAt: '2023-01-01T12:00:00Z',
          updatedAt: '2023-01-01T12:00:00Z',
        }
      ]
    }
  })
  async findByCnpj(@Param('cnpj') cnpj: string): Promise<EcoPointResponseDto[]> {
    return this.ecoPointsService.findByCnpj(cnpj);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar ecoponto (apenas empresa dona)' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    type: UpdateEcoPointDto,
    examples: {
      valid: {
        summary: 'Exemplo válido',
        value: {
          title: 'Novo título',
          opening_hours: '09:00-17:00',
        },
      },
      invalid: {
        summary: 'Exemplo inválido',
        value: {
          title: '',
        },
      },
    },
  })
  @ApiResponse({
    status: 200, description: 'Ecoponto atualizado com sucesso.', schema: {
      example: {
        id: '1',
        companyId: 'empresa123',
        title: 'Novo título',
        cnpj: '12.345.678/0001-99',
        opening_hours: '09:00-17:00',
        interval: 'Semanal',
        accepted_materials: ['Plástico', 'Vidro'],
        address: 'Rua das Flores, 123',
        coordinates: '-9.741951520552348,-36.660397991379185',
        createdAt: '2023-01-01T12:00:00Z',
        updatedAt: '2023-01-01T12:00:00Z',
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.', schema: { example: { success: false, message: 'Título é obrigatório' } } })
  @ApiResponse({ status: 403, description: 'Apenas a empresa dona pode atualizar.', schema: { example: { success: false, message: 'Apenas a empresa dona pode atualizar.' } } })
  async update(
    @Param('id') id: string,
    @Body() updateEcoPointDto: UpdateEcoPointDto,
    @Req() req
  ): Promise<EcoPointResponseDto> {
    const user = req.user;
    return this.ecoPointsService.updateWithPermission(id, updateEcoPointDto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover ecoponto (apenas empresa dona)' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'EcoPoint removido com sucesso.', schema: { example: { message: 'EcoPoint removido com sucesso' } } })
  @ApiResponse({ status: 403, description: 'Apenas a empresa dona pode remover.', schema: { example: { success: false, message: 'Apenas a empresa dona pode remover.' } } })
  async remove(@Param('id') id: string, @Req() req): Promise<{ message: string }> {
    const user = req.user;
    await this.ecoPointsService.removeWithPermission(id, user.userId);
    return { message: 'EcoPoint removido com sucesso' };
  }

  @Get('my-ecopoints/:id')
  @ApiOperation({ summary: 'Listar ecopontos de uma empresa' })
  @ApiParam({ name: 'id', type: String, description: 'ID da empresa' })
  @ApiResponse({
    status: 200, description: 'Lista de ecopontos da empresa.', schema: {
      example: [
        {
          id: '1',
          companyId: 'empresa123',
          title: 'Ecoponto Central',
          cnpj: '12.345.678/0001-99',
          opening_hours: '08:00-18:00',
          interval: 'Semanal',
          accepted_materials: ['Plástico', 'Vidro'],
          address: 'Rua das Flores, 123',
          coordinates: '-9.741951520552348,-36.660397991379185',
          createdAt: '2023-01-01T12:00:00Z',
          updatedAt: '2023-01-01T12:00:00Z',
        }
      ]
    }
  })
  async myEcopoints(@Param('id') id: string): Promise<EcoPointResponseDto[]> {
    return this.ecoPointsService.findByCompanyId(id);
  }
}