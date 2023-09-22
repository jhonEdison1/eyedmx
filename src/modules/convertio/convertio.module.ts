import { Module } from '@nestjs/common';
import { ConvertioService } from './convertio.service';
import { ConvertioController } from './convertio.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ParametrosModule } from '../parametros/parametros.module';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    ParametrosModule
  ],
  controllers: [ConvertioController],
  providers: [ConvertioService],
  exports: [ConvertioService]
})
export class ConvertioModule {}
