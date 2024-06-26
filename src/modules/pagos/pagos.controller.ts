import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { JwtAuthAccessGuard } from '../iam/guards/jwt-auth.guard';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../iam/decorators';
import { Role } from '../iam/models/roles.model';
import { RolesGuard } from '../iam/guards/roles.guard';
import { estadoPago } from './entities/pago.entity';
import { EstadoPagoDto } from './dto/update-estado-pago.dto';
import { FilterPagoDto } from './dto/filter-pago.dto';
import { OtrosPagoDto } from './dto/otros-pago.dto';

@ApiTags("pagos")
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post('/crearIntento')
  @UseGuards(JwtAuthAccessGuard)
  create(@Body() createPagoDto: CreatePagoDto) {
   try {
    return this.pagosService.create(createPagoDto);
   } catch (error) {
    return {error: error.message}
    
   }
  }

  

  @Get('/obtenerIntento/:id')
  @UseGuards(JwtAuthAccessGuard)
  findOne(@Param('id') id: string) {
    try {
    return this.pagosService.findOne(id);
    } catch (error) {

      return {error: error.message}

    }
  }

  @Patch('generarMetodo/:id')
  @UseGuards(JwtAuthAccessGuard)
  update(@Param('id') id: string, @Body() updatePagoDto: UpdatePagoDto) {
    return this.pagosService.update(id, updatePagoDto);
  }


 // @Get('')


  @Patch('confirmar/:id')
  @UseGuards(JwtAuthAccessGuard)
  confirmar(@Param('id') id: string) {
    return this.pagosService.confirmar(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Patch('actualizarPagoEfectivo/:id')
  actualizarPagoEfectivo(@Param('id') id: string, @Body() estado: EstadoPagoDto) {
    
    return this.pagosService.actualizarPagoEfectivo(id, estado);
  }

  @Roles(Role.ADMIN)
  @Patch('cambiarEstadoOMetodo/:id')
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  cambiarEstadoOMetodo(@Param('id') id: string, @Body() cambios: EstadoPagoDto) {
    return this.pagosService.cambiarEstadoOMetodo(id, cambios);
  }


  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthAccessGuard, RolesGuard)
  @Get('filter')
  getFilter(@Query() filter: FilterPagoDto){
    return this.pagosService.getFilter(filter);

  }



  @Patch('actualizarIntento/:id')
  @UseGuards(JwtAuthAccessGuard)
  updateIntento(@Param('id') id: string, @Body() updatePagoDto: OtrosPagoDto) {
    return this.pagosService.updateIntento(id, updatePagoDto);
  }
  



  
}
