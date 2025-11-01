import { Controller, Post, Body, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Controller('reclamacao')
export class ReclamacaoController {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  @Post()
  async enviarReclamacao(
    @Body() body: { nome: string; email: string; mensagem: string },
  ) {
    const { nome, email, mensagem } = body;

    console.log('📩 Recebido:', body);

    if (!nome || !email || !mensagem) {
      console.log('⚠️ Campos ausentes');
      return { success: false, message: 'Todos os campos são obrigatórios.' };
    }

    try {
      console.log('🚀 Tentando enviar e-mail...');
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER, // usa o seu email, não o do usuário
        replyTo: email,
        to: process.env.EMAIL_USER,
        subject: `Nova reclamação de ${nome}`,
        text: mensagem,
      });
      console.log('✅ E-mail enviado!');
      return { success: true, message: 'Reclamação enviada com sucesso!' };
    } catch (error) {
      console.error('❌ Erro ao enviar e-mail:', error);
      throw new InternalServerErrorException('Erro ao enviar e-mail.');
    }
  }
}
