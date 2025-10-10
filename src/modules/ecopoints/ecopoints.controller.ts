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
  UseGuards
} from '@nestjs/common';
import { EcoPointsService } from './ecopoints.service';
import { CreateEcoPointDto } from './dto/create-ecopoint.dto';
import { UpdateEcoPointDto } from './dto/update-ecopoint.dto';
import { EcoPointResponseDto } from './dto/ecopoint-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ForbiddenException, Req } from '@nestjs/common';

@Controller('ecopoints')
@UsePipes(new ValidationPipe({ transform: true }))
export class EcoPointsController {
  constructor(private readonly ecoPointsService: EcoPointsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createEcoPointDto: CreateEcoPointDto, @Req() req): Promise<EcoPointResponseDto> {
    const user = req.user;
    if (!user || user.role !== 'enterprise') {
      throw new ForbiddenException('Apenas empresas podem cadastrar ecopontos.');
    }
    return this.ecoPointsService.create({ ...createEcoPointDto, companyId: user.userId });
  }

  @Get()
  async findAll(): Promise<EcoPointResponseDto[]> {
    return this.ecoPointsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EcoPointResponseDto> {
    return this.ecoPointsService.findOne(id);
  }

  @Get('cnpj/:cnpj')
  async findByCnpj(@Param('cnpj') cnpj: string): Promise<EcoPointResponseDto | null> {
    return this.ecoPointsService.findByCnpj(cnpj);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
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
  async remove(@Param('id') id: string, @Req() req): Promise<{ message: string }> {
    const user = req.user;
    await this.ecoPointsService.removeWithPermission(id, user.userId);
    return { message: 'EcoPoint removido com sucesso' };
  }

  @Get('my-ecopoints/:id')
  async myEcopoints(@Param('id') id: string): Promise<EcoPointResponseDto[]> {
    return this.ecoPointsService.findByCompanyId(id);
  }
}