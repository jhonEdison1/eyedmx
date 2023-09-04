import { Module } from '@nestjs/common';
import { TiposService } from './tipos.service';
import { TiposController } from './tipos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tipo, TipoSchema } from './entities/tipo.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tipo.name, schema: TipoSchema}])
  ],
  controllers: [TiposController],
  providers: [TiposService],
  exports: [TiposService]
})
export class TiposModule {}
