import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateParametroDto } from './dto/create-parametro.dto';
import { UpdateParametroDto } from './dto/update-parametro.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Parametro } from './entities/parametro.entity';
import { FilterQuery, Model } from 'mongoose';
import { FilterParametroDto } from './dto/filter-parametros.dto';

@Injectable()
export class ParametrosService {


  constructor(
    @InjectModel(Parametro.name)
    private readonly parametroModel: Model<Parametro>
  ) {}







  async create(createParametroDto: CreateParametroDto) {

    const exist = await this.existeParametro(createParametroDto.nombre)
    if(exist){
      throw new ConflictException('ya existe un parametro con ese nombre')
    }



    const parametro = await new this.parametroModel(createParametroDto);
    return parametro.save();   
  }


  async existeParametro(nombre:string){
    const parametro =await this.parametroModel.findOne({nombre: nombre})
    if(parametro){
      return true
    }else{
      return false
    }
  }



  async findOneByName(nombre:string){
    const parametro =await this.parametroModel.findOne({nombre: nombre})
    return parametro.valor
  }

  async findAll(params?: FilterParametroDto) {
    const filters: FilterQuery<Parametro> = {}
    const {limit, offset} = params

    const [parametros, totalDocuments] = await Promise.all([
      this.parametroModel.find(filters)
      .skip(offset * limit)
      .limit(limit)
      .exec(),
      this.parametroModel.countDocuments(filters).exec()
    ])

    return{
      parametros,
      totalDocuments
    }


  }

  async findOne(id: string) {

    const parametro = await this.parametroModel.findById(id)
    return parametro
   
  }

  async update(id: string, updateParametroDto: UpdateParametroDto) {

    const exist = await this.parametroModel.findById(id)

    if(!exist){
      throw new NotFoundException('Parametro no encontrado')
    }

    const parametro = await this.parametroModel.findByIdAndUpdate(id, updateParametroDto, {new: true})

    return parametro
    
  }

  remove(id: number) {
    return `This action removes a #${id} parametro`;
  }
}
