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
    ValidationPipe
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
    async findByCompany(@Param('companyId') companyId: string) {
        return this.service.findByCompany(companyId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('user/:userId')
    async findByUser(@Param('userId') userId: string) {
        return this.service.findByUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body() statusDto: UpdateRequestCollectionStatusDto,
        @Req() req
    ) {
        return this.service.updateStatus(id, statusDto, req.user.userId);
    }
}
