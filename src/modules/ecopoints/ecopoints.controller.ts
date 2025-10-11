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
  @ApiBody({ type: CreateEcoPointDto })
  @ApiResponse({ status: 201, description: 'Ecoponto criado com sucesso.', type: EcoPointResponseDto })
  @ApiResponse({ status: 403, description: 'Apenas empresas podem cadastrar ecopontos.' })
  async create(@Body() createEcoPointDto: CreateEcoPointDto, @Req() req): Promise<EcoPointResponseDto> {
    const user = req.user;
    if (!user || user.role !== 'enterprise') {
      throw new ForbiddenException('Apenas empresas podem cadastrar ecopontos.');
    }
    return this.ecoPointsService.create({ ...createEcoPointDto, companyId: user.userId });
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os ecopontos' })
  @ApiResponse({ status: 200, description: 'Lista de ecopontos.', type: [EcoPointResponseDto] })
  async findAll(): Promise<EcoPointResponseDto[]> {
    return this.ecoPointsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar ecoponto por ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Ecoponto encontrado.', type: EcoPointResponseDto })
  @ApiResponse({ status: 404, description: 'Ecoponto não encontrado.' })
  async findOne(@Param('id') id: string): Promise<EcoPointResponseDto> {
    return this.ecoPointsService.findOne(id);
  }

  @Get('cnpj/:cnpj')
  @ApiOperation({ summary: 'Buscar ecoponto por CNPJ' })
  @ApiParam({ name: 'cnpj', type: String })
  @ApiResponse({ status: 200, description: 'Ecoponto encontrado.', type: EcoPointResponseDto })
  @ApiResponse({ status: 404, description: 'Ecoponto não encontrado.' })
  async findByCnpj(@Param('cnpj') cnpj: string): Promise<EcoPointResponseDto | null> {
    return this.ecoPointsService.findByCnpj(cnpj);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar ecoponto (apenas empresa dona)' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateEcoPointDto })
  @ApiResponse({ status: 200, description: 'Ecoponto atualizado com sucesso.', type: EcoPointResponseDto })
  @ApiResponse({ status: 403, description: 'Apenas a empresa dona pode atualizar.' })
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
  @ApiResponse({ status: 200, description: 'EcoPoint removido com sucesso.' })
  @ApiResponse({ status: 403, description: 'Apenas a empresa dona pode remover.' })
  async remove(@Param('id') id: string, @Req() req): Promise<{ message: string }> {
    const user = req.user;
    await this.ecoPointsService.removeWithPermission(id, user.userId);
    return { message: 'EcoPoint removido com sucesso' };
  }

  @Get('my-ecopoints/:id')
  @ApiOperation({ summary: 'Listar ecopontos de uma empresa' })
  @ApiParam({ name: 'id', type: String, description: 'ID da empresa' })
  @ApiResponse({ status: 200, description: 'Lista de ecopontos da empresa.', type: [EcoPointResponseDto] })
  async myEcopoints(@Param('id') id: string): Promise<EcoPointResponseDto[]> {
    return this.ecoPointsService.findByCompanyId(id);
  }
}