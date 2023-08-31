import { Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { ConfigModule } from '@nestjs/config';
import { Pago, PagoSchema } from './entities/pago.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { IamModule } from '../iam/iam.module';
import { StripeService } from './stripe.service';


@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Pago.name, schema: PagoSchema }]),
    IamModule

  ],
  controllers: [PagosController],
  providers: [PagosService, StripeService],
  exports: [PagosService]

})
export class PagosModule {}
