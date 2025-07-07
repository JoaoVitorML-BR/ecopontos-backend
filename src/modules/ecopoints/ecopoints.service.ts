import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IEcoPointDocument, IEcoPointModel } from './dto/IEcoPoint';
import { CreateEcoPointDto } from './dto/create-ecopoint.dto';
import { UpdateEcoPointDto } from './dto/update-ecopoint.dto';
import { EcoPointResponseDto } from './dto/ecopoint-response.dto';

@Injectable()
export class EcoPointsService {
  constructor(
    @InjectModel('EcoPoint') private ecoPointModel: IEcoPointModel
  ) {}

  async create(createEcoPointDto: CreateEcoPointDto): Promise<EcoPointResponseDto> {
    const ecoPoint = new this.ecoPointModel(createEcoPointDto);
    const savedEcoPoint = await ecoPoint.save();
    return this.toResponseDto(savedEcoPoint);
  }

  async findAll(): Promise<EcoPointResponseDto[]> {
    const ecoPoints = await this.ecoPointModel.find().exec();
    return ecoPoints.map(ecoPoint => this.toResponseDto(ecoPoint));
  }

  async findOne(id: string): Promise<EcoPointResponseDto> {
    const ecoPoint = await this.ecoPointModel.findOne({ id }).exec();
    if (!ecoPoint) {
      throw new NotFoundException('EcoPoint não encontrado');
    }
    return this.toResponseDto(ecoPoint);
  }

  async findByCnpj(cnpj: string): Promise<EcoPointResponseDto | null> {
    const ecoPoint = await this.ecoPointModel.findOne({ cnpj }).exec();
    return ecoPoint ? this.toResponseDto(ecoPoint) : null;
  }

  async update(id: string, updateEcoPointDto: UpdateEcoPointDto): Promise<EcoPointResponseDto> {
    const ecoPoint = await this.ecoPointModel
      .findOneAndUpdate({ id }, updateEcoPointDto, { new: true })
      .exec();

    if (!ecoPoint) {
      throw new NotFoundException('EcoPoint não encontrado');
    }

    return this.toResponseDto(ecoPoint);
  }

  async remove(id: string): Promise<void> {
    const result = await this.ecoPointModel.findOneAndDelete({ id }).exec();
    if (!result) {
      throw new NotFoundException('EcoPoint não encontrado');
    }
  }

  private toResponseDto(ecoPoint: IEcoPointDocument): EcoPointResponseDto {
    return {
      id: ecoPoint.id,
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
