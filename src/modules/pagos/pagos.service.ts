import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigType } from '@nestjs/config';
import config from 'src/config';
import { Pago, metodoPago } from './entities/pago.entity';
import { Model } from 'mongoose';
import { StripeService } from './stripe.service';


@Injectable()
export class PagosService {


  constructor(
    @Inject(config.KEY) private readonly configSerivce: ConfigType<typeof config>,
    @InjectModel(Pago.name) private readonly pagoModel: Model<Pago>,
    private readonly stripeService: StripeService

  ) {

  }



  async create(createPagoDto: CreatePagoDto) {


    const nuevoPago = await new this.pagoModel(createPagoDto);
    return nuevoPago.save();



  }



  async findOne(id: string) {
    try {

      const pago = await this.pagoModel.findById(id);
      return pago;

    } catch (error) {
      throw new NotFoundException('No se encontro el La intencion de pago')

    }

  }

  async update(id: string, updatePagoDto: UpdatePagoDto) {

    try {
      const pago = await this.pagoModel.findById(id).populate({ path: 'userId', select: 'email' }).exec()
      if (!pago) {
        throw new NotFoundException('No se encontro el La intencion de pago')
      }

      if (pago.metodo === metodoPago.Stripe) {
        const email = pago.userId['email']

        const responseMethod = await this.stripeService.generatePaymentMethod(updatePagoDto.token);


        const resPaymentIntent = await this.stripeService.createPaymentIntent(pago.monto, email, responseMethod.id);


        await this.pagoModel.findByIdAndUpdate(id, { stripeId: resPaymentIntent.id }).exec();

        return resPaymentIntent;

      } else {
        return { error: 'Metodo de pago no soportado' }

      }

    } catch (error) {

      throw new ConflictException('No se pudo Procesar el pago ' + error.message)

    }


  }



  async confirmar(id: string) {
    try {
      const pago = await this.pagoModel.findById(id).populate({ path: 'userId', select: 'email' }).exec()
      if (!pago) {
        throw new NotFoundException('No se encontro el La intencion de pago')
      }

      if (pago.metodo === metodoPago.Stripe) {

        const detailStripe = await this.stripeService.getPaymentDetail(pago.stripeId);

      


        const status = detailStripe.status.includes('succe') ? 'success' : 'fail';

        await this.pagoModel.findByIdAndUpdate(id, { status }).exec();


        return detailStripe;

      } else {
        return { error: 'Metodo de pago no soportado' }

      }

    } catch (error) {

      throw new ConflictException('No se pudo Procesar el pago ' + error.message)

    }


  }





  remove(id: number) {
    return `This action removes a #${id} pago`;
  }
}
