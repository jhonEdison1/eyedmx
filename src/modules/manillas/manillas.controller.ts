import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ManillasService } from './manillas.service';
import {CreateManillaDto } from './dto/create-manilla.dto';
import { UpdateManillaDto } from './dto/update-manilla.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthAccessGuard } from '../iam/guards/jwt-auth.guard';
import { Roles } from '../iam/decorators';
import { Role } from '../iam/models/roles.model';
import { RolesGuard } from '../iam/guards/roles.guard';
import { FilterManillaDto } from './dto/filter-manilla.dto';
import { IdsAprobarDto } from './dto/ids-aprobar.dto';
import { CreateEntradaDto } from '../entradas/dto/create-entrada.dto';
import { filter } from 'rxjs';

@ApiTags("manillas")
@Controller('manillas')
export class ManillasController {
  constructor(private readonly manillasService: ManillasService) {}

  @Post('solicitar')
  @UseGuards(JwtAuthAccessGuard)
  create(@Body() createManillaDto: CreateManillaDto,  @Request() req) {    
    return this.manillasService.createManilla(createManillaDto, req.user.id);
  }


  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('solicitudes')
  findSolicitudes(@Query() params?: FilterManillaDto) {
   return this.manillasService.findSolicitudes(params);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('produccion')
  findAceptadas(@Query() params?: FilterManillaDto) {
    return this.manillasService.findAceptadasHoy(params);
  }
  
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('findAll')
  findAll(@Query() params?: FilterManillaDto) {
    return this.manillasService.findAll(params);
  }


  @Get('estados')
  getEstados() {
    return this.manillasService.getEstados();
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Patch('aprobar/:id')
  aprobar(@Param('id') id: string) {
    return this.manillasService.aceptarManilla(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Post('aprobarTodas')
  aprobarTodas() {
    return this.manillasService.aceptarTodasLasManillas();
  }


  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Patch('enviar/:id')
  enviar(@Param('id') id: string) {
    return this.manillasService.enviarManilla(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Post('enviarVarias')
  enviarVarias(@Body() body: IdsAprobarDto) {
    return this.manillasService.enviarVariasManillas(body.ids);
  }
 



  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Post('aprobarVarias')
  aprobarVarias(@Body() body: IdsAprobarDto) {
    return this.manillasService.aceptarVariasManillas(body.ids);
  }
  
  @Get('findById/:id')
  findOne(@Param('id') id: string) {
    return this.manillasService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateManillaDto: UpdateManillaDto) {
    return this.manillasService.update(+id, updateManillaDto);
  }


  @UseGuards(JwtAuthAccessGuard)
  @Get('MisManillas')
  findMisManillas(@Request() req, @Query() filter?: FilterManillaDto) {
    return this.manillasService.obtenerMisManillasAgrupadasPorTipo(req.user.id, filter);
  }

  @Roles(Role.TALLER)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('ObtenerInfoMotoPorPlaca/:placa')
  obtenerInfoMotoPorPlaca(@Param('placa') placa: string, @Request() req) {
    return this.manillasService.obtenerInfoMotoPorPlaca(placa, req.user.id);
  }


  @Roles(Role.TALLER)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Post('crearEntrada/:placa')
  crearEntrada(@Param('placa') placa: string, @Body() body: CreateEntradaDto, @Request() req ) {

    return this.manillasService.crearEntradaManilla(placa, body, req.user.id);


  }




  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.manillasService.remove(+id);
  }
}
