import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { HashingService } from 'src/providers/hashing/hashing.service';
import { ErrorsService } from '../errors/errors.service';
import { ManillasService } from '../manillas/manillas.service';

@Injectable()
export class UsersService {


  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashingService: HashingService,
    private readonly errorService: ErrorsService
  

  ) {

  }









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
