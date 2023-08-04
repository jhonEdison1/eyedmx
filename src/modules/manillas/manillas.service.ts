import { Injectable } from '@nestjs/common';
import { CreateManillaDto, ManillaAdulto_MayorDto, ManillaMascotaDto, ManillaMoteroDto, ManillaNiñoDto } from './dto/create-manilla.dto';
import { UpdateManillaDto } from './dto/update-manilla.dto';
import { validate } from 'class-validator';
import { Manilla } from './entities/manilla.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ManillasService {

  constructor(
    @InjectModel(Manilla.name) private readonly manillaModel: Model<Manilla>
   

  ) {
   
  }







  create(createManillaDto: CreateManillaDto) {
    return 'This action adds a new manilla';
  }

  async createManillaMotero(createManillaDto: ManillaMoteroDto) {
    const newRecord = new this.manillaModel(createManillaDto);
    const newManilla =  await newRecord.save();
    return newManilla;

  }

  async createManillaAdultoMayor(createManillaDto: ManillaAdulto_MayorDto) {    
    const newRecord = new this.manillaModel(createManillaDto);
    const newManilla =  await newRecord.save();
    return newManilla;
  }

  async createManillaNiño(createManillaDto: ManillaNiñoDto) {
    const newRecord = new this.manillaModel(createManillaDto);
    const newManilla =  await newRecord.save();
    return newManilla;
  }

  async createManillaMascota(createManillaDto: ManillaMascotaDto){
    const newRecord = new this.manillaModel(createManillaDto);
    const newManilla =  await newRecord.save();
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
