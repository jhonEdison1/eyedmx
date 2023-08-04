import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateManillaDto, ManillaAdulto_MayorDto, ManillaMascotaDto, ManillaMoteroDto, ManillaNiñoDto } from './dto/create-manilla.dto';
import { UpdateManillaDto } from './dto/update-manilla.dto';
import { validate } from 'class-validator';
import { Manilla } from './entities/manilla.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Tipos } from '../iam/authentication/authentication.common.service';

@Injectable()
export class ManillasService {

  constructor(
    @InjectModel(Manilla.name) private readonly manillaModel: Model<Manilla>


  ) {

  }


  async createManilla(createManillaDto: CreateManillaDto, userId: string ) {

    
    // Validar el objeto recibido utilizando las decoraciones de class-validator
    const errors = await validate(createManillaDto);
    if (errors.length > 0) {
      throw new ConflictException('Datos inválidos');
    }

    if(createManillaDto.userId !== userId){
      throw new UnauthorizedException('No tiene permisos para crear manillas para otro usuario');
    }

    // Identificar el tipo de manilla en función de la propiedad 'tipo'
    let manilla;

    switch (createManillaDto.tipo) {
      case Tipos.Motero:
        manilla = new ManillaMoteroDto();
        break;
      case Tipos.Adulto_Mayor:
        manilla = new ManillaAdulto_MayorDto();
        break;
      case Tipos.Niño:
        manilla = new ManillaNiñoDto();
        break;
      case Tipos.Mascota:
        manilla = new ManillaMascotaDto();
        break;
      default:
        throw new ConflictException('Tipo de manilla no válido');
    }

    // Asignar los valores del objeto recibido a la instancia de la manilla
    Object.assign(manilla, createManillaDto);

    // Validar la instancia específica de la manilla
    const customErrors = await validate(manilla);
    if (customErrors.length > 0) {
      throw new ConflictException('Datos inválidos para el tipo de manilla');
    }

    // Crear la manilla en la base de datos
    const newRecord = new this.manillaModel(manilla);
    const newManilla = await newRecord.save();
    return newManilla;
  }

  async createManillaMotero(createManillaDto: ManillaMoteroDto) {
    const newRecord = new this.manillaModel(createManillaDto);
    const newManilla = await newRecord.save();
    return newManilla;

  }

  async createManillaAdultoMayor(createManillaDto: ManillaAdulto_MayorDto) {
    const newRecord = new this.manillaModel(createManillaDto);
    const newManilla = await newRecord.save();
    return newManilla;
  }

  async createManillaNiño(createManillaDto: ManillaNiñoDto) {
    const newRecord = new this.manillaModel(createManillaDto);
    const newManilla = await newRecord.save();
    return newManilla;
  }

  async createManillaMascota(createManillaDto: ManillaMascotaDto) {
    const newRecord = new this.manillaModel(createManillaDto);
    const newManilla = await newRecord.save();
    return newManilla;
  }



  findAll() {
    return `This action returns all manillas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} manilla`;
  }

  update(id: number, updateManillaDto: UpdateManillaDto) {
    return `This action updates a #${id} manilla`;
  }

  remove(id: number) {
    return `This action removes a #${id} manilla`;
  }








}
