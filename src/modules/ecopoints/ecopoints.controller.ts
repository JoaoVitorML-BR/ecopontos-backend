import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UsePipes,
  ValidationPipe 
} from '@nestjs/common';
import { EcoPointsService } from './ecopoints.service';
import { CreateEcoPointDto } from './dto/create-ecopoint.dto';
import { UpdateEcoPointDto } from './dto/update-ecopoint.dto';
import { EcoPointResponseDto } from './dto/ecopoint-response.dto';

@Controller('ecopoints')
@UsePipes(new ValidationPipe({ transform: true }))
export class EcoPointsController {
  constructor(private readonly ecoPointsService: EcoPointsService) {}

  @Post()
  async create(@Body() createEcoPointDto: CreateEcoPointDto): Promise<EcoPointResponseDto> {
    return this.ecoPointsService.create(createEcoPointDto);
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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEcoPointDto: UpdateEcoPointDto,
  ): Promise<EcoPointResponseDto> {
    return this.ecoPointsService.update(id, updateEcoPointDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.ecoPointsService.remove(id);
    return { message: 'EcoPoint removido com sucesso' };
  }
}
