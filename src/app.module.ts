import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EcoPointsModule } from './modules/ecopoints/ecopoints.module';
import { UsersModule } from './modules/users/users.module';
import { ExternalModule } from './modules/external/external.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/eco_arapiraca'
    ),
    CommonModule,
    EcoPointsModule,
    UsersModule,
    ExternalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
