import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigType } from '@nestjs/config';
import config from 'src/config';
import { Pago, estadoPago, metodoPago } from './entities/pago.entity';
import { FilterQuery, Model } from 'mongoose';
import { StripeService } from './stripe.service';
import { th } from 'date-fns/locale';
import { EstadoPagoDto } from './dto/update-estado-pago.dto';
import { ManillasService } from '../manillas/manillas.service';
import { FilterPagoDto } from './dto/filter-pago.dto';
import { OtrosPagoDto } from './dto/otros-pago.dto';
import { TiposService } from '../tipos/tipos.service';


@Injectable()
export class PagosService {


  constructor(
    @Inject(config.KEY) private readonly configSerivce: ConfigType<typeof config>,
    @InjectModel(Pago.name) private readonly pagoModel: Model<Pago>,
    private readonly stripeService: StripeService,
    private readonly manillasService: ManillasService,
    private readonly tiposService: TiposService

  ) {

  }



  async create(createPagoDto: CreatePagoDto) {


    const tiposPorManilla = []
    const precioPorManilla = []

    for (const manilla of createPagoDto.manillasId) {
      const existpagoByManilla = await this.findPagobyManilla(manilla);
      if(existpagoByManilla){
        throw new ConflictException('Ya existe un pago para esta manilla')
      }

      let tipo = await this.manillasService.getTipoPorIdManilla(manilla);
      tiposPorManilla.push(tipo);
    } 


    for (const tipo of tiposPorManilla) {
      const precio = await this.tiposService.getPrecioPorTipo(tipo);
      precioPorManilla.push(precio);      
    }

    //sumar los precios

    const monto = precioPorManilla.reduce((a, b) => a + b, 0);


    createPagoDto.monto = monto;



    
    


    const nuevoPago = await new this.pagoModel(createPagoDto);
    await nuevoPago.save();
    for (const manilla of createPagoDto.manillasId) {
      await this.manillasService.actualizarPago(manilla, nuevoPago._id.toString());
    } 
   

    return nuevoPago;
  }





  async findPagobyManilla(id: string) {

    // const pago = await this.pagoModel.findOne({ manillaId: id }, { __v: 0, userId: 0, monto: 0 }).exec();

    const pago = await this.pagoModel.findOne({ manillasId: id }, { __v: 0, userId: 0, monto: 0 }).exec();

    if (!pago) {
      return null;
    }

    return pago;

    

  }



  async findOne(id: string) {
    try {

      const pago = await this.pagoModel.findById(id) .populate({ path: 'manillasId' })
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

        await this.pagoModel.findByIdAndUpdate(id, { estado: status }).exec();

        for (const manilla of pago.manillasId) {
          await this.manillasService.changeEstadoPago(manilla.toString());
        }
          
        

       //await this.manillasService.changeEstadoPago(pago.manillaId.toString());




        return detailStripe;

      } else {
        return { error: 'Metodo de pago no soportado' }

      }

    } catch (error) {

      throw new ConflictException('No se pudo Procesar el pago ' + error.message)

    }


  }



  async actualizarPagoEfectivo(id: string, estado: EstadoPagoDto) {

    const pago = await this.pagoModel.findById(id).exec();

    if (!pago) {
      throw new NotFoundException('No se encontro el La intencion de pago')
    }

    if (pago.estado === estado.estado) {
      throw new ConflictException('El estado enviado es el mismo que el actual')
    }

    if (pago.metodo === metodoPago.Efectivo) {
      await this.pagoModel.findByIdAndUpdate(id, { estado: estado.estado }).exec();

      for (const manilla of pago.manillasId) {
        await this.manillasService.changeEstadoPago(manilla.toString());
      }
        
      
     // await this.manillasService.changeEstadoPago(pago.manillaId.toString());

      return { message: 'Se actualizo el estado del pago' }

    } else {
      throw new ConflictException('No se pudo Procesar el pago ' + 'Metodo de pago no soportado')
    }


  }


  async getFilter(filter: FilterPagoDto) {

    const {limit, offset, estado, metodo} = filter;


    const filters: FilterQuery<Pago> = {  };
   // const { limit, offset, name } = params;

    /** Si existen parámetros entonces aplicamos filtros de búsqueda */
    if (filter) {
      if (estado) {
        filters.estado = {
          $regex: estado,
          $options: "i",
        };
      }
      if (metodo) {
        filters.metodo = {
          $regex: metodo,
          $options: "i",
        };
      }

    }

    

    const pagos = await this.pagoModel.find(filters)
      .populate({ path: 'userId', select: 'email name' })
      .populate({ path: 'manillasId' })
      //.populate({ path: 'manillaId', select: 'tipo estado nombre_portador numid foto_portador nombre_mascota' })
      .skip(offset * limit)
      .limit(limit)
      .exec()



  


    const total = await this.pagoModel.countDocuments(filters).exec();


    return { pagos, total }

  }


  async updateIntento(id: string, updatePagoDto: OtrosPagoDto) {

    const pago = await this.pagoModel.findById(id).exec();
    if(!pago){
      throw new NotFoundException('No se encontro el La intencion de pago')
    }

    pago.otros = updatePagoDto.otros;

    await pago.save();

    return pago;


  }

  async cambiarEstadoOMetodo(id: string, cambios: EstadoPagoDto) {

    const pago = await this.pagoModel.findById(id).exec();
    if(!pago){
      throw new NotFoundException('No se encontro el La intencion de pago')
    }

    if(pago.estado === cambios.estado && pago.metodo === cambios.metodo){
      throw new ConflictException('No se realizaron cambios')
    }

    if(pago.estado !== cambios.estado){
      pago.estado = cambios.estado as estadoPago;
    }

    if(pago.metodo !== cambios.metodo){
      pago.metodo = cambios.metodo as metodoPago;
    }

    await pago.save();
    for (const manilla of pago.manillasId){
      await this.manillasService.changeEstadoPago(manilla.toString());
    }

    return {message: 'Se realizaron los cambios', pago}
  }





  remove(id: number) {
    return `This action removes a #${id} pago`;
  }
}
