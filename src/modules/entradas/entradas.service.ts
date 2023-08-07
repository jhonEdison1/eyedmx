import { Injectable } from '@nestjs/common';
import { CreateEntradaDto, InfoEntradaDto } from './dto/create-entrada.dto';
import { UpdateEntradaDto } from './dto/update-entrada.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Entrada } from './entities/entrada.entity';
import { FilterQuery, Model } from 'mongoose';
import { FilterEntradaDto } from './dto/filte-entrada.dto';

@Injectable()
export class EntradasService {


  constructor(
    @InjectModel(Entrada.name) private readonly entradaModel: Model<Entrada>,
  ) {}





  async findByPlacaAndTaller(placa: string, taller: string) {
    const entradas = await this.entradaModel.find({placa: placa, taller: taller}).populate({path: 'taller', select: 'name'});
    return entradas;
  }

  async create(createEntradaDto: InfoEntradaDto) {
    const entrada = (await this.entradaModel.create(createEntradaDto)).populate({path: 'taller', select: 'name'});
  }


  async findMisEntradas(params: FilterEntradaDto, taller: string){
   

    const filters: FilterQuery<Entrada> = { taller: taller};
    const {limit, offset, placa} = params;

    /** Si existen parámetros entonces aplicamos filtros de búsqueda */
    if (params) {
      if (placa) {
        filters.placa = {
          $regex: placa,
          $options: "i",
        };
      }     
    }
    const entradas = await this.entradaModel.find(filters).populate({path: 'taller', select: 'name'}).skip(offset).limit(limit);

    const totalDocuments = await this.entradaModel.countDocuments(filters).exec();
    
    return {
      entradas,
      totalDocuments
    }
  }

  findAll() {
    return `This action returns all entradas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} entrada`;
  }

  update(id: number, updateEntradaDto: UpdateEntradaDto) {
    return `This action updates a #${id} entrada`;
  }

  remove(id: number) {
    return `This action removes a #${id} entrada`;
  }
}
