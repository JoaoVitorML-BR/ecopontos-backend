import { Module } from '@nestjs/common';
import { ReclamacaoController } from './reclamacao.controller';

@Module({
  controllers: [ReclamacaoController],
})
export class ReclamacaoModule {}
