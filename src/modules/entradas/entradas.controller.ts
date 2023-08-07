import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { EntradasService } from './entradas.service';
import { CreateEntradaDto } from './dto/create-entrada.dto';
import { UpdateEntradaDto } from './dto/update-entrada.dto';
import { Roles } from '../iam/decorators';
import { Role } from '../iam/models/roles.model';
import { JwtAuthAccessGuard } from '../iam/guards/jwt-auth.guard';
import { RolesGuard } from '../iam/guards/roles.guard';

import { FilterEntradaDto } from './dto/filte-entrada.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags("entradas")
@Controller('entradas')
export class EntradasController {
  constructor(private readonly entradasService: EntradasService) {}

  // @Post()
  // create(@Body() createEntradaDto: CreateEntradaDto) {
  //   return this.entradasService.create(createEntradaDto);
  // }


  @Roles(Role.TALLER)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('MisEntradas')
  findAll(  @Request() req, @Query() params?: FilterEntradaDto,) {
    return this.entradasService.findMisEntradas(params, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entradasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntradaDto: UpdateEntradaDto) {
    return this.entradasService.update(+id, updateEntradaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entradasService.remove(+id);
  }
}
