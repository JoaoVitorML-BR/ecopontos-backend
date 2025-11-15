import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RequestCollectionService } from './request-collection.service';
import { EcoPointsService } from '../ecopoints/ecopoints.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('RequestCollectionService', () => {
    let service: RequestCollectionService;

    const mockModel: any = {
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
    };

    const mockEcoPointsService = {
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RequestCollectionService,
                { provide: getModelToken('RequestCollection'), useValue: mockModel },
                { provide: EcoPointsService, useValue: mockEcoPointsService },
            ],
        }).compile();

        service = module.get<RequestCollectionService>(RequestCollectionService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getEcoPointById', () => {
        it('should call ecoPointsService.findOne', async () => {
            mockEcoPointsService.findOne.mockResolvedValue({ id: 'ep1' });
            const result = await service.getEcoPointById('ep1');
            expect(mockEcoPointsService.findOne).toHaveBeenCalledWith('ep1');
            expect(result).toEqual({ id: 'ep1' });
        });
    });

    describe('findByCompany and findByUser', () => {
        it('should call find with companyId', async () => {
            mockModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(['a']) });
            const res = await service.findByCompany('comp1');
            expect(mockModel.find).toHaveBeenCalledWith({ companyId: 'comp1' });
            expect(res).toEqual(['a']);
        });

        it('should call find with userId', async () => {
            mockModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(['u']) });
            const res = await service.findByUser('user1');
            expect(mockModel.find).toHaveBeenCalledWith({ userId: 'user1' });
            expect(res).toEqual(['u']);
        });
    });

    describe('findById', () => {
        it('should call findById and return value', async () => {
            mockModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: '1' }) });
            const res = await service.findById('1');
            expect(mockModel.findById).toHaveBeenCalledWith('1');
            expect(res).toEqual({ _id: '1' });
        });
    });

    describe('updateStatus', () => {
        it('should throw NotFoundException when request not found', async () => {
            mockModel.findById.mockResolvedValue(null);
            await expect(service.updateStatus('1', { status: 'aceito' } as any, 'comp')).rejects.toThrow(NotFoundException);
        });

        it('should throw ForbiddenException when company mismatch', async () => {
            mockModel.findById.mockResolvedValue({ companyId: 'other' });
            await expect(service.updateStatus('1', { status: 'aceito' } as any, 'comp')).rejects.toThrow(ForbiddenException);
        });

        it('should set notified fields when status is em_coleta and update', async () => {
            const found = { companyId: 'comp' };
            mockModel.findById.mockResolvedValue(found);
            const updated = { _id: '1', status: 'em_coleta', notified: true };
            mockModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(updated) });

            const res = await service.updateStatus('1', { status: 'em_coleta' } as any, 'comp');
            expect(mockModel.findByIdAndUpdate).toHaveBeenCalled();
            expect(res).toEqual(updated);
        });
    });
});
