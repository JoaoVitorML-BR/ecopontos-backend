import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestCollectionController } from './request-collection.controller';
import { RequestCollectionService } from './request-collection.service';
import { RequestCollectionSchema } from './schemas/request-collection.schema';
import { EcoPointsModule } from '../ecopoints/ecopoints.module';
import { EcoPointSchema } from '../ecopoints/schemas/ecopoint.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'RequestCollection', schema: RequestCollectionSchema },
      { name: 'EcoPoint', schema: EcoPointSchema }
    ]),
    EcoPointsModule
  ],
  controllers: [RequestCollectionController],
  providers: [RequestCollectionService],
  exports: [RequestCollectionService],
})
export class RequestCollectionModule {}