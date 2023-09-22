import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ParametrosService } from './parametros.service';
import { CreateParametroDto } from './dto/create-parametro.dto';
import { UpdateParametroDto } from './dto/update-parametro.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilterParametroDto } from './dto/filter-parametros.dto';

@ApiTags("parametros")
@Controller('parametros')
export class ParametrosController {
  constructor(private readonly parametrosService: ParametrosService) {}

  @Post()
  create(@Body() createParametroDto: CreateParametroDto) {
    return this.parametrosService.create(createParametroDto);
  }

  @Get()
  findAll(@Query() filter: FilterParametroDto) {
    return this.parametrosService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parametrosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParametroDto: UpdateParametroDto) {
    return this.parametrosService.update(id, updateParametroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parametrosService.remove(+id);
  }
}
