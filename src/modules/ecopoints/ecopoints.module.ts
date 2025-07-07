import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EcoPointsService } from './ecopoints.service';
import { EcoPointsController } from './ecopoints.controller';
import { EcoPointSchema } from './schemas/ecopoint.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'EcoPoint', schema: EcoPointSchema }
    ])
  ],
  controllers: [EcoPointsController],
  providers: [EcoPointsService],
  exports: [EcoPointsService],
})
export class EcoPointsModule {}
