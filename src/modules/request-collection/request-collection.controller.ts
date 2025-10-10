import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    Get,
    Param,
    Patch,
    NotFoundException,
    UsePipes,
    ValidationPipe,
    ForbiddenException
} from '@nestjs/common';
import { RequestCollectionService } from './request-collection.service';
import { CreateRequestCollectionDto } from './dto/create-request-collection.dto';
import { UpdateRequestCollectionStatusDto } from './dto/update-request-collection-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('request-collection')
@UsePipes(new ValidationPipe({ transform: true }))
export class RequestCollectionController {
    constructor(private readonly service: RequestCollectionService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() dto: CreateRequestCollectionDto, @Req() req) {
        const ecoPoint = await this.service.getEcoPointById(dto.ecopointId);
        if (!ecoPoint) {
            throw new NotFoundException('Ecoponto não encontrado');
        }
        return this.service.create(dto, req.user.userId, ecoPoint.companyId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('company/:companyId')
    async findByCompany(@Param('companyId') companyId: string, @Req() req) {
        if (req.user.userId !== companyId) {
            throw new ForbiddenException('Acesso restrito à empresa responsável.');
        }
        return this.service.findByCompany(companyId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('user/:userId')
    async findByUser(@Param('userId') userId: string, @Req() req) {
        if (req.user.userId !== userId) {
            throw new ForbiddenException('Acesso restrito ao usuario responsável.');
        }
        return this.service.findByUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body() statusDto: UpdateRequestCollectionStatusDto,
        @Req() req
    ) {
        const request = await this.service.findById(id);
        if (!request) {
            throw new NotFoundException('Solicitação de coleta não encontrada');
        }
        if (request.companyId.toString() !== req.user.userId) {
            throw new ForbiddenException('Apenas a empresa responsável pode atualizar o status.');
        }
        return this.service.updateStatus(id, statusDto, req.user.userId);
    }
}
