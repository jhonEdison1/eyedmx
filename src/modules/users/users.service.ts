import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { FilterQuery, Model } from 'mongoose';
import { HashingService } from 'src/providers/hashing/hashing.service';
import { ErrorsService } from '../errors/errors.service';
import { ManillasService } from '../manillas/manillas.service';
import { Role } from '../iam/models/roles.model';
import { FilterUsersDto } from './dto';
import { CreateUserTallerDto } from './dto/create-taller.dto';
import { ConfigType } from '@nestjs/config';
import config from 'src/config';
import * as AWS from 'aws-sdk';


@Injectable()
export class UsersService {

  private readonly s3: AWS.S3;


  constructor(
    @Inject(config.KEY) private readonly configService: ConfigType<typeof config>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashingService: HashingService,
    private readonly errorService: ErrorsService,
    private readonly manillasService: ManillasService

  ) {
    AWS.config.update({
      accessKeyId: configService.s3.accessKeyId,
      secretAccessKey: configService.s3.secretAccessKey,
      region: configService.s3.region
    });

    this.s3 = new AWS.S3();
  }









  async create(payload: CreateUserDto) {

    try {
      const existemail = await this.userModel.exists({ email: payload.email.trim() });
      if(existemail){
        throw new ConflictException('El correo ya existe');
      }


      payload.password = await this.hashingService.hash(payload.password.trim());
     
      const newRecord = new this.userModel(payload);
      if(payload.fotoBase64){
        payload.fotoBase64 = await this.uploadBase64ToS3(newRecord._id.toString(), payload.fotoBase64);
      }

      newRecord.fotoBase64 = payload.fotoBase64;
      const newuser = await newRecord.save();
      return newuser;



    } catch (error) {
      this.errorService.createError(error);
    }

  }

  async uploadBase64ToS3(id: string, base64Data: string): Promise<string> {
    const buffer = Buffer.from(base64Data, 'base64');

    const uploadFolderPath = 'users'; // Carpeta base en S3
    const fileName = `users/${id}/${Date.now()}.jpg`; // Nombre de archivo

    const s3Params: AWS.S3.PutObjectRequest = {
      Bucket: this.configService.s3.bucket,
      Key: fileName,
      Body: buffer,
      ContentType: 'image/jpeg', // Ajustar según el tipo de imagen
    };

    try {
      const data = await this.s3.putObject(s3Params).promise();
      const urlfoto = this.s3.getSignedUrl('getObject', {
        Bucket: this.configService.s3.bucket,
        Key: `${fileName}`

      });


      //return `https://${this.configService.s3.bucket}.s3.${this.configService.s3.region}.amazonaws.com/${fileName}`;
      return urlfoto;
      
    } catch (error) {
      throw new Error(`Error al subir la imagen a S3: ${error.message}`);
    }
  }

  async singupTaller(payload: CreateUserTallerDto) {

    try {
      const existemail = await this.userModel.exists({ email: payload.email.trim() });
      if(existemail){
        throw new ConflictException('El correo ya existe');
      }
      payload.password = await this.hashingService.hash(payload.password.trim());
      const newRecord = new this.userModel(payload);
      newRecord.role = Role.TALLER;
      newRecord.aceptado = false;

      if(payload.fotoBase64){
        payload.fotoBase64 = await this.uploadBase64ToS3(newRecord._id.toString(), payload.fotoBase64);
      }

      newRecord.fotoBase64 = payload.fotoBase64;


      const newuser = await newRecord.save();
      return newuser;
    } catch (error) {
      this.errorService.createError(error);
    }



  }


  async createTaller(payload: CreateUserTallerDto) {
    try {

      const existemail = await this.userModel.exists({ email: payload.email.trim() });
      if(existemail){
        throw new ConflictException('El correo ya existe');
      }
      payload.password = await this.hashingService.hash(payload.password.trim());
      const newRecord = new this.userModel(payload);
      newRecord.role = Role.TALLER;

      if(payload.fotoBase64){
        payload.fotoBase64 = await this.uploadBase64ToS3(newRecord._id.toString(), payload.fotoBase64);
      }

      newRecord.fotoBase64 = payload.fotoBase64;



      const newuser = await newRecord.save();
      return newuser;
    } catch (error) {
      this.errorService.createError(error);
    }



  }


  async findAllUsersClients(params?: FilterUsersDto) {



    const filters: FilterQuery<User> = { role: Role.USER };
    const { limit, offset, name } = params;

    /** Si existen parámetros entonces aplicamos filtros de búsqueda */
    if (params) {
      if (name) {
        filters.name = {
          $regex: name,
          $options: "i",
        };
      }
    }

    const [users, totalDocuments] = await Promise.all([
      this.userModel
        .find(filters)
        .skip(offset)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(filters).exec(),
    ]);

    return {
      users,
      totalDocuments
    };
  }



  async findAllUsersTalleres(params?: FilterUsersDto) {


    const filters: FilterQuery<User> = { role: Role.TALLER };
    const { limit, offset, name } = params;

    /** Si existen parámetros entonces aplicamos filtros de búsqueda */
    if (params) {
      if (name) {
        filters.name = {
          $regex: name,
          $options: "i",
        };
      }
    }

    const [talleres, totalDocuments] = await Promise.all([
      this.userModel
        .find(filters)
        .skip(offset)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(filters).exec(),
    ]);

    return {
      talleres,
      totalDocuments
    };



  }


  async findOneTaller(id: string) {

    try {
      const taller = await this.userModel.findOne({ _id: id, role: Role.TALLER }).exec();
      return taller;
    } catch (error) {
      this.errorService.createError(error);
    }


  }


  async aceptarTaller(id: string) {

    try {
      const taller = await this.userModel.findOne({ _id: id, role: Role.TALLER }).exec();

      if (!taller) {
        throw new ConflictException('El taller no existe');
      }
      if (taller.aceptado) {
        throw new ConflictException('El taller ya fue aceptado anteriormente');
      }
      taller.aceptado = true;
      await taller.save();
      return taller;

    } catch (error) {
      this.errorService.createError(error);

    }



  }


  async findOneCliente(id: string) {

    try {
      const cliente = await this.userModel.findOne({ _id: id, role: Role.USER }).exec();

      cliente.password = undefined;

      //antes de retornar el cliente, verificamos que exista
      if (!cliente) {
        throw new ConflictException('El cliente no existe');
      }

      //buscamos las manillas del cliente
      const manillas = await this.manillasService.obtenerMisManillasAgrupadasPorTipo(id);

      //asignamos las manillas al cliente
      let clienteConManillas = cliente.toObject();
      clienteConManillas['manillas'] = manillas;



      return clienteConManillas;
    } catch (error) {
      this.errorService.createError(error);
    }

  }



  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
