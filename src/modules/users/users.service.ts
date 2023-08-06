import { ConflictException, Injectable } from '@nestjs/common';
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


@Injectable()
export class UsersService {


  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashingService: HashingService,
    private readonly errorService: ErrorsService,
    private readonly manillasService: ManillasService

  ) { }









  async create(payload: CreateUserDto) {

    try {


      payload.password = await this.hashingService.hash(payload.password.trim());
      const newRecord = new this.userModel(payload);
      const newuser = await newRecord.save();
      return newuser;



    } catch (error) {
      this.errorService.createError(error);
    }

  }

  async singupTaller(payload: CreateUserTallerDto) {

    try {
      payload.password = await this.hashingService.hash(payload.password.trim());
      const newRecord = new this.userModel(payload);
      newRecord.role = Role.TALLER;
      newRecord.aceptado = false;
      const newuser = await newRecord.save();
      return newuser;
    } catch (error) {
      this.errorService.createError(error);
    }



  }


  async createTaller(payload: CreateUserTallerDto) {
    try {
      payload.password = await this.hashingService.hash(payload.password.trim());
      const newRecord = new this.userModel(payload);
      newRecord.role = Role.TALLER;
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
