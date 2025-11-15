import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { EcoPointsService } from './ecopoints.service';
import { HttpClientService } from '../../common/services/http-client.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('EcoPointsService', () => {
  let service: EcoPointsService;

  const mockModel: any = {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    find: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockHttpClient = {
    validateCnpj: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EcoPointsService,
        { provide: getModelToken('EcoPoint'), useValue: mockModel },
        { provide: HttpClientService, useValue: mockHttpClient },
      ],
    }).compile();

    service = module.get<EcoPointsService>(EcoPointsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates ecoPoint when CNPJ valid', async () => {
      mockHttpClient.validateCnpj.mockResolvedValue({ status: 'OK' });
      const fakeDoc = { save: jest.fn().mockResolvedValue({ _id: '1', title: 't', cnpj: '123' }) };
      // simulate constructor returning instance
      const ModelCtor: any = function (dto: any) { return fakeDoc; };
      // replace model with constructor
      (service as any).ecoPointModel = ModelCtor;

      const res = await service.create({ title: 't', cnpj: '123' } as any);
      expect(mockHttpClient.validateCnpj).toHaveBeenCalledWith('123');
      expect(res).toHaveProperty('id', '1');
    });

    it('throws when CNPJ invalid', async () => {
      mockHttpClient.validateCnpj.mockResolvedValue({ status: 'ERROR' });
      const ModelCtor: any = function (dto: any) { return { save: jest.fn() }; };
      (service as any).ecoPointModel = ModelCtor;

      await expect(service.create({ cnpj: 'bad' } as any)).rejects.toThrow(Error);
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when not found', async () => {
      mockModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('returns dto when found', async () => {
      const doc = { _id: '1', companyId: 'c', title: 't', cnpj: 'x', opening_hours: '', interval: '', accepted_materials: [], address: '', coordinates: '', createdAt: new Date(), updatedAt: new Date() };
      mockModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(doc) });
      const res = await service.findOne('1');
      expect(res).toHaveProperty('id', '1');
      expect(res).toHaveProperty('title', 't');
    });
  });

  describe('updateWithPermission', () => {
    it('updates when owner matches', async () => {
      const found = { _id: '1', companyId: 'comp', toString() { return 'comp'; } } as any;
      mockModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(found) });
      const updated = { _id: '1', title: 'new' };
      mockModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(updated) });

      const res = await service.updateWithPermission('1', { title: 'new' } as any, 'comp');
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { title: 'new' }, { new: true });
      expect(res).toHaveProperty('id', '1');
    });

    it('throws NotFoundException when not found', async () => {
      mockModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(service.updateWithPermission('1', {} as any, 'comp')).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when user not owner', async () => {
      const found = { _id: '1', companyId: { toString: () => 'other' } } as any;
      mockModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(found) });
      await expect(service.updateWithPermission('1', {} as any, 'comp')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('removeWithPermission', () => {
    it('removes when owner matches', async () => {
      const found = { _id: '1', companyId: { toString: () => 'comp' } } as any;
      mockModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(found) });
      mockModel.findByIdAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue({}) });
      await expect(service.removeWithPermission('1', 'comp')).resolves.toBeUndefined();
      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });

    it('throws NotFoundException when not found', async () => {
      mockModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(service.removeWithPermission('1', 'comp')).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when not owner', async () => {
      const found = { _id: '1', companyId: { toString: () => 'other' } } as any;
      mockModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(found) });
      await expect(service.removeWithPermission('1', 'comp')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('maps documents to dto', async () => {
      const docs = [{ _id: '1', companyId: 'c', title: 't', cnpj: 'x', opening_hours: '', interval: '', accepted_materials: [], address: '', coordinates: '', createdAt: new Date(), updatedAt: new Date() }];
      mockModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(docs) });
      const res = await service.findAll();
      expect(Array.isArray(res)).toBe(true);
      expect(res[0]).toHaveProperty('id', '1');
    });
  });
});
