import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { MongoIdPipe } from 'src/common/pipes/mongo-id.pipe';
import { JwtAuthAccessGuard } from '../iam/guards/jwt-auth.guard';
import { CreateUserDto, UpdateUserDto, FilterUsersDto, ChangePasswordDto } from './dto';
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
  createTaller(@Body() payload: CreateUserTallerDto) {
    return this.usersService.createTaller(payload);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('Kpi')
  getKpi( @Query('fechaInicio') fechaInicio: string, @Query('fechaFin') fechaFin: string) {
    return this.usersService.getKpi(fechaInicio, fechaFin);
  }




  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('cliente/:id')
  findOneCliente(@Param('id', MongoIdPipe) id: string) {
    return this.usersService.findOneCliente(id);
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
  @Get('All/talleres/aceptados')
  findAllTalleresAceptados(@Query() filter: FilterUsersDto) {
    return this.usersService.findAllUsersTalleresAceptados(filter);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('All/talleres/pendientes')
  findAllTalleresPendientes(@Query() filter: FilterUsersDto) {
    return this.usersService.findAllUsersTalleresPendientes(filter);
  }




  


  @UseGuards(JwtAuthAccessGuard)
  @Patch('editarUsuario/:id')  
  update(@Param('id', MongoIdPipe) id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.updateCliente(id, updateUserDto, req.user);
  }


  @UseGuards(JwtAuthAccessGuard)
  @Patch('ChangePassword')
  changePassword(@Body() payload: ChangePasswordDto, @Request() req) {
    return this.usersService.changePassword(req.user.id, payload);
  }

  
}
