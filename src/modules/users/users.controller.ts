import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { MongoIdPipe } from 'src/common/pipes/mongo-id.pipe';
import { JwtAuthAccessGuard } from '../iam/guards/jwt-auth.guard';
import { CreateUserDto, UpdateUserDto, FilterUsersDto } from './dto';
import { Roles, Plan} from '../iam/decorators';
import { Role } from '../iam/models/roles.model';
import { RolesGuard } from '../iam/guards/roles.guard';
import { CreateUserTallerDto } from './dto/create-taller.dto';

@ApiTags("users")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("create")
  create(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }


  @Post('singup/taller')
  singupTaller(@Body() payload: CreateUserTallerDto) {
    return this.usersService.singupTaller(payload);
  }


  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Post('create/taller')
  createTaller(@Body() payload: CreateUserDto) {
    return this.usersService.createTaller(payload);
  }

  //@UseGuards(JwtAuthAccessGuard)
  @Roles(Role.USER)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('All')
  findAll() {
    return this.usersService.findAll();
  }


  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('All/clientes')
  findAllUsers(@Query() filter: FilterUsersDto) {
    return this.usersService.findAllUsersClients(filter);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('All/talleres')
  findAllTalleres(@Query() filter: FilterUsersDto) {
    return this.usersService.findAllUsersTalleres(filter);
  }


  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('taller/:id')
  findOneTaller(@Param('id', MongoIdPipe) id: string) {
    return this.usersService.findOneTaller(id);
  }


  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Patch('taller/aceptar/:id')
  aceptarTaller(@Param('id', MongoIdPipe) id: string) {
    return this.usersService.aceptarTaller(id);
  }


  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('cliente/:id')
  findOneCliente(@Param('id', MongoIdPipe) id: string) {
    return this.usersService.findOneCliente(id);
  }

  @Get(':id')
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', MongoIdPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
