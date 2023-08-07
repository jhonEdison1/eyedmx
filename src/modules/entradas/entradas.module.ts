import { Module } from '@nestjs/common';
import { EntradasService } from './entradas.service';
import { EntradasController } from './entradas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Entrada, EntradaSchema } from './entities/entrada.entity';
import { IamModule } from '../iam/iam.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Entrada.name, schema: EntradaSchema }]),
    IamModule
  ],
  controllers: [EntradasController],
  providers: [EntradasService],
  exports: [EntradasService]
})
export class EntradasModule {}
