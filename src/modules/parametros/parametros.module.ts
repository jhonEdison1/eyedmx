import { Module } from '@nestjs/common';
import { ParametrosService } from './parametros.service';
import { ParametrosController } from './parametros.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Parametro, ParametroSchema } from './entities/parametro.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Parametro.name , schema: ParametroSchema }]),
  ],
  controllers: [ParametrosController],
  providers: [ParametrosService],
  exports: [ParametrosService]
})
export class ParametrosModule {}
