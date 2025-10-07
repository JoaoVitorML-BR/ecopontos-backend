import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { EcoPointsService } from './ecopoints.service';
import { HttpClientService } from '../../common/services/http-client.service';
import { EcoPointsController } from './ecopoints.controller';
import { EcoPointSchema } from './schemas/ecopoint.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'EcoPoint', schema: EcoPointSchema }
    ]),
    HttpModule,
  ],
  controllers: [EcoPointsController],
  providers: [EcoPointsService, HttpClientService],
  exports: [EcoPointsService],
})
export class EcoPointsModule { }
