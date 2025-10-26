import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IEcoPointDocument, IEcoPointModel } from './dto/IEcoPoint';
import { HttpClientService } from '../../common/services/http-client.service';
import { CreateEcoPointDto } from './dto/create-ecopoint.dto';
import { UpdateEcoPointDto } from './dto/update-ecopoint.dto';
import { EcoPointResponseDto } from './dto/ecopoint-response.dto';

@Injectable()
export class EcoPointsService {
  async updateWithPermission(id: string, updateEcoPointDto: UpdateEcoPointDto, userId: string): Promise<EcoPointResponseDto> {
    const ecoPoint = await this.ecoPointModel.findById(id).exec();
    if (!ecoPoint) {
      throw new NotFoundException('EcoPoint não encontrado');
    }
    if (ecoPoint.companyId.toString() !== userId) {
      throw new ForbiddenException('Você não tem permissão para editar este ecoponto.');
    }
    const updatedEcoPoint = await this.ecoPointModel
      .findByIdAndUpdate(id, updateEcoPointDto, { new: true })
      .exec();
    return this.toResponseDto(updatedEcoPoint);
  }

  async removeWithPermission(id: string, userId: string): Promise<void> {
    const ecoPoint = await this.ecoPointModel.findById(id).exec();
    if (!ecoPoint) {
      throw new NotFoundException('EcoPoint não encontrado');
    }
    if (ecoPoint.companyId.toString() !== userId) {
      throw new ForbiddenException('Você não tem permissão para deletar este ecoponto.');
    }
    await this.ecoPointModel.findByIdAndDelete(id).exec();
  }
  constructor(
    @InjectModel('EcoPoint') private ecoPointModel: IEcoPointModel,
    private readonly httpClientService: HttpClientService
  ) { }

  async create(createEcoPointDto: CreateEcoPointDto): Promise<EcoPointResponseDto> {
    const cnpjValidation = await this.httpClientService.validateCnpj(createEcoPointDto.cnpj);
    if (!cnpjValidation || cnpjValidation.status === 'ERROR') {
      throw new Error('CNPJ inválido ou não encontrado na Receita Federal.');
    }
    const ecoPoint = new this.ecoPointModel(createEcoPointDto);
    const savedEcoPoint = await ecoPoint.save();
    return this.toResponseDto(savedEcoPoint);
  }

  async findAll(): Promise<EcoPointResponseDto[]> {
    const ecoPoints = await this.ecoPointModel.find().exec();
    return ecoPoints.map(ecoPoint => this.toResponseDto(ecoPoint));
  }

  async findOne(id: string): Promise<EcoPointResponseDto> {
    const ecoPoint = await this.ecoPointModel.findById(id).exec();
    if (!ecoPoint) {
      throw new NotFoundException('EcoPoint não encontrado');
    }
    return this.toResponseDto(ecoPoint);
  }

  async findByCnpj(cnpj: string): Promise<EcoPointResponseDto[]> {
    const ecoPoints = await this.ecoPointModel.find({ cnpj }).exec();
    return ecoPoints.map(ecoPoint => this.toResponseDto(ecoPoint));
  }

  async update(id: string, updateEcoPointDto: UpdateEcoPointDto): Promise<EcoPointResponseDto> {
    const ecoPoint = await this.ecoPointModel
      .findByIdAndUpdate(id, updateEcoPointDto, { new: true })
      .exec();

    if (!ecoPoint) {
      throw new NotFoundException('EcoPoint não encontrado');
    }

    return this.toResponseDto(ecoPoint);
  }

  async remove(id: string): Promise<void> {
    const result = await this.ecoPointModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('EcoPoint não encontrado');
    }
  }

  async findByCompanyId(companyId: string): Promise<EcoPointResponseDto[]> {
    const ecoPoints = await this.ecoPointModel.find({ companyId }).exec();
    return ecoPoints.map(ecoPoint => this.toResponseDto(ecoPoint));
  }

  private toResponseDto(ecoPoint: IEcoPointDocument): EcoPointResponseDto {
    return {
      id: ecoPoint._id ? ecoPoint._id.toString() : '',
      companyId: ecoPoint.companyId ? ecoPoint.companyId.toString() : '',
      title: ecoPoint.title,
      cnpj: ecoPoint.cnpj,
      opening_hours: ecoPoint.opening_hours,
      interval: ecoPoint.interval,
      accepted_materials: ecoPoint.accepted_materials,
      address: ecoPoint.address,
      coordinates: ecoPoint.coordinates,
      createdAt: ecoPoint.createdAt,
      updatedAt: ecoPoint.updatedAt
    };
  }
}
