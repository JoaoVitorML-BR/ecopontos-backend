const mockSendMail = jest.fn();

jest.mock('nodemailer', () => ({
    createTransport: jest.fn(() => ({
        sendMail: mockSendMail,
    })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ReclamacaoController } from './reclamacao.controller';
import { InternalServerErrorException } from '@nestjs/common';

describe('ReclamacaoController', () => {
    let controller: ReclamacaoController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReclamacaoController],
        }).compile();

        controller = module.get<ReclamacaoController>(ReclamacaoController);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('returns error when fields missing', async () => {
        const res = await controller.enviarReclamacao({ nome: '', email: '', mensagem: '' });
        expect(res).toEqual({ success: false, message: 'Todos os campos são obrigatórios.' });
    });

    it('sends email and returns success when transport resolves', async () => {
        const fake = { nome: 'João', email: 'j@e.com', mensagem: 'Teste' };
        mockSendMail.mockResolvedValue({});
        const res = await controller.enviarReclamacao(fake as any);
        expect(mockSendMail).toHaveBeenCalled();
        expect(res).toEqual({ success: true, message: 'Reclamação enviada com sucesso!' });
    });

    it('throws InternalServerErrorException when sendMail fails', async () => {
        const fake = { nome: 'João', email: 'j@e.com', mensagem: 'Teste' };
        mockSendMail.mockRejectedValue(new Error('fail'));
        await expect(controller.enviarReclamacao(fake as any)).rejects.toThrow(InternalServerErrorException);
    });
});
