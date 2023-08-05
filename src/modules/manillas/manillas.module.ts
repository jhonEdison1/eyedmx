import { Module } from '@nestjs/common';
import { ManillasService } from './manillas.service';
import { ManillasController } from './manillas.controller';
import { Manilla, ManillaSchema } from './entities/manilla.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { IamModule } from '../iam/iam.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Manilla.name, schema: ManillaSchema }]),
    IamModule    

  ],
  controllers: [ManillasController],
  providers: [ManillasService],
  exports: [ManillasService]
})
export class ManillasModule {}
