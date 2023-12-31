import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTipoDto } from './dto/create-tipo.dto';
import { UpdateTipoDto } from './dto/update-tipo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tipo } from './entities/tipo.entity';
import { Model } from 'mongoose';

@Injectable()
export class TiposService {



  constructor(
    @InjectModel(Tipo.name) private readonly tipoModel: Model<Tipo>
  ) {
  }




  async create(createTipoDto: CreateTipoDto) {
    
    const exist = await this.existByNombre(createTipoDto.name);
    if (exist) {
      throw new ConflictException('El tipo ya existe');
    }
    const nuevoTipo = await new this.tipoModel(createTipoDto);
    return nuevoTipo.save();
  }


  async existByNombre(nombre: String) {
    const tipo = await this.tipoModel.findOne({ name: nombre });
    return tipo;
  }



  async getPrecioPorTipo(nombre: String) {
    const tipo = await this.tipoModel.findOne({ name: nombre });
    return tipo.precio;
  }

  async findAll() {
    const tipos = await this.tipoModel.find();
    return tipos;
  }

  async findOne(id: String) {
    const tipo = await this.tipoModel.findById(id);
    if(!tipo){
      throw new ConflictException('El tipo no existe');
    }
    return tipo;
  }

  async update(id: String, updateTipoDto: UpdateTipoDto) {

    const tipo = await this.tipoModel.findById(id);
    if(!tipo){
      throw new ConflictException('El tipo no existe');
    }

    tipo.precio = updateTipoDto.precio;
    tipo.description = updateTipoDto.description;

    return tipo.save();


  }

  remove(id: number) {
    return `This action removes a #${id} tipo`;
  }
}
