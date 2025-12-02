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
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { RequestCollectionService } from './request-collection.service';
import { CreateRequestCollectionDto } from './dto/create-request-collection.dto';
import { UpdateRequestCollectionStatusDto } from './dto/update-request-collection-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Solicitações de Coleta')
@Controller('request-collection')
@UsePipes(new ValidationPipe({ transform: true }))
export class RequestCollectionController {
    constructor(private readonly service: RequestCollectionService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Criar solicitação de coleta' })
    @ApiBody({
        type: CreateRequestCollectionDto,
        examples: {
            valid: {
                summary: 'Exemplo válido',
                value: {
                    ecopointId: '1',
                    requestedDate: '2023-12-01',
                    materials: ['Plástico', 'Vidro'],
                },
            },
            invalid: {
                summary: 'Exemplo inválido',
                value: {
                    ecopointId: '',
                    requestedDate: '',
                    materials: [],
                },
            },
        },
    })
    @ApiResponse({
        status: 201, description: 'Solicitação criada com sucesso.', schema: {
            example: {
                id: 'req1',
                ecopointId: '1',
                userId: 'user1',
                companyId: 'empresa1',
                requestedDate: '2023-12-01',
                materials: ['Plástico', 'Vidro'],
                status: 'pendente',
                createdAt: '2023-12-01T12:00:00Z',
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Dados inválidos.', schema: { example: { success: false, message: 'ecopointId é obrigatório' } } })
    @ApiResponse({ status: 404, description: 'Ecoponto não encontrado.', schema: { example: { success: false, message: 'Ecoponto não encontrado' } } })
    async create(@Body() dto: CreateRequestCollectionDto, @Req() req) {
        const ecoPoint = await this.service.getEcoPointById(dto.ecopointId);
        if (!ecoPoint) {
            throw new NotFoundException('Ecoponto não encontrado');
        }
        return this.service.create(dto, req.user.userId, ecoPoint.companyId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('company/:companyId')
    @ApiOperation({ summary: 'Listar solicitações por empresa' })
    @ApiParam({ name: 'companyId', type: String, description: 'ID da empresa' })
    @ApiResponse({
        status: 200, description: 'Lista de solicitações da empresa.', schema: {
            example: [
                {
                    id: 'req1',
                    ecopointId: '1',
                    userId: 'user1',
                    companyId: 'empresa1',
                    requestedDate: '2023-12-01',
                    materials: ['Plástico', 'Vidro'],
                    status: 'pendente',
                    createdAt: '2023-12-01T12:00:00Z',
                }
            ]
        }
    })
    @ApiResponse({ status: 403, description: 'Acesso restrito à empresa responsável.', schema: { example: { success: false, message: 'Acesso restrito à empresa responsável.' } } })
    async findByCompany(@Param('companyId') companyId: string, @Req() req) {
        if (req.user.userId !== companyId) {
            throw new ForbiddenException('Acesso restrito à empresa responsável.');
        }
        return this.service.findByCompany(companyId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('user/:userId')
    @ApiOperation({ summary: 'Listar solicitações por usuário' })
    @ApiParam({ name: 'userId', type: String, description: 'ID do usuário' })
    @ApiResponse({
        status: 200, description: 'Lista de solicitações do usuário.', schema: {
            example: [
                {
                    id: 'req1',
                    ecopointId: '1',
                    userId: 'user1',
                    companyId: 'empresa1',
                    requestedDate: '2023-12-01',
                    materials: ['Plástico', 'Vidro'],
                    status: 'pendente',
                    createdAt: '2023-12-01T12:00:00Z',
                }
            ]
        }
    })
    @ApiResponse({ status: 403, description: 'Acesso restrito ao usuário responsável.', schema: { example: { success: false, message: 'Acesso restrito ao usuário responsável.' } } })
    async findByUser(@Param('userId') userId: string, @Req() req) {
        if (req.user.userId !== userId) {
            throw new ForbiddenException('Acesso restrito ao usuario responsável.');
        }
        return this.service.findByUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    @ApiOperation({ summary: 'Atualizar status da solicitação (apenas empresa responsável)' })
    @ApiParam({ name: 'id', type: String, description: 'ID da solicitação' })
    @ApiBody({
        type: UpdateRequestCollectionStatusDto,
        examples: {
            valid: {
                summary: 'Exemplo válido',
                value: {
                    status: 'finalizada',
                },
            },
            invalid: {
                summary: 'Exemplo inválido',
                value: {
                    status: '',
                },
            },
        },
    })
    @ApiResponse({
        status: 200, description: 'Status atualizado com sucesso.', schema: {
            example: {
                id: 'req1',
                status: 'finalizada',
                updatedAt: '2023-12-02T12:00:00Z',
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Dados inválidos.', schema: { example: { success: false, message: 'Status é obrigatório' } } })
    @ApiResponse({ status: 403, description: 'Apenas a empresa responsável pode atualizar o status.', schema: { example: { success: false, message: 'Apenas a empresa responsável pode atualizar o status.' } } })
    @ApiResponse({ status: 404, description: 'Solicitação de coleta não encontrada.', schema: { example: { success: false, message: 'Solicitação de coleta não encontrada' } } })
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
