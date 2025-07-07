import { Module } from '@nestjs/common';
import { ExternalController } from './external.controller';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ExternalController],
})
export class ExternalModule {}
