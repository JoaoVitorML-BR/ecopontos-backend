import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EcoPointsService } from '../ecopoints/ecopoints.service';
import { CreateRequestCollectionDto } from './dto/create-request-collection.dto';
import { UpdateRequestCollectionStatusDto } from './dto/update-request-collection-status.dto';

@Injectable()
export class RequestCollectionService {
    constructor(
        @InjectModel('RequestCollection') private requestCollectionModel: Model<any>,
        private readonly ecoPointsService: EcoPointsService
    ) { }

    async getEcoPointById(ecopointId: string): Promise<any> {
        return this.ecoPointsService.findOne(ecopointId);
    }

    async create(createDto: CreateRequestCollectionDto, userId: string, companyId: string): Promise<any> {
        const request = new this.requestCollectionModel({
            ...createDto,
            userId,
            companyId,
            status: 'pendente',
            notified: false,
        });
        return await request.save();
    }

    async findByCompany(companyId: string): Promise<any[]> {
        return this.requestCollectionModel.find({ companyId }).exec();
    }

    async findByUser(userId: string): Promise<any[]> {
        return this.requestCollectionModel.find({ userId }).exec();
    }

    async findById(id: string): Promise<any> {
        return this.requestCollectionModel.findById(id).exec();
    }

    async updateStatus(id: string, statusDto: UpdateRequestCollectionStatusDto, companyId: string): Promise<any> {
        const request = await this.requestCollectionModel.findById(id);
        if (!request) throw new NotFoundException('Solicitação não encontrada');
        if (request.companyId.toString() !== companyId) throw new ForbiddenException('Acesso negado');
        request.status = statusDto.status;
        if (statusDto.status === 'em_coleta') {
            request.notified = true;
            request.notifiedAt = new Date();
        }
        await request.save();
        return request;
    }
}
