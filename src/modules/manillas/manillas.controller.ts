import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ManillasService } from './manillas.service';
import { CreateManillaDto } from './dto/create-manilla.dto';
import { UpdateManillaDto } from './dto/update-manilla.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthAccessGuard } from '../iam/guards/jwt-auth.guard';
import { Roles } from '../iam/decorators';
import { Role } from '../iam/models/roles.model';
import { RolesGuard } from '../iam/guards/roles.guard';
import { FilterManillaDto } from './dto/filter-manilla.dto';

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
  
  @Get('findById/:id')
  findOne(@Param('id') id: string) {
    return this.manillasService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateManillaDto: UpdateManillaDto) {
    return this.manillasService.update(+id, updateManillaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.manillasService.remove(+id);
  }
}
