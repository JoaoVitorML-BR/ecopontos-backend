import { Test, TestingModule } from '@nestjs/testing';
import { ExternalController } from './external.controller';
import { HttpClientService } from '../../common/services/http-client.service';

describe('ExternalController', () => {
    let controller: ExternalController;

    const mockHttpClient = {
        validateCnpj: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ExternalController],
            providers: [{ provide: HttpClientService, useValue: mockHttpClient }],
        }).compile();

        controller = module.get<ExternalController>(ExternalController);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('returns success and data when httpClientService resolves', async () => {
        const fakeData = { cnpj: '123', name: 'Empresa' };
        mockHttpClient.validateCnpj.mockResolvedValue(fakeData);
        const res = await controller.validateCnpj('123');
        expect(mockHttpClient.validateCnpj).toHaveBeenCalledWith('123');
        expect(res).toEqual({ success: true, data: fakeData });
    });

    it('returns success:false and message when httpClientService throws', async () => {
        mockHttpClient.validateCnpj.mockRejectedValue(new Error('fail'));
        const res = await controller.validateCnpj('000');
        expect(res).toEqual({ success: false, message: 'fail' });
    });
});
