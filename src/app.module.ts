import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EcoPointsModule } from './modules/ecopoints/ecopoints.module';
import { RequestCollectionModule } from './modules/request-collection/request-collection.module';
import { UsersModule } from './modules/users/users.module';
import { ExternalModule } from './modules/external/external.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './common/common.module';
import { ReclamacaoModule } from './reclamacao/reclamacao.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/eco_arapiraca'
    ),
    CommonModule,
    AuthModule,
    EcoPointsModule,
    RequestCollectionModule,
    UsersModule,
    ExternalModule,
    ReclamacaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
