import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ManillasService } from './manillas.service';
import { CreateManillaDto } from './dto/create-manilla.dto';
import { UpdateManillaDto } from './dto/update-manilla.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("manillas")
@Controller('manillas')
export class ManillasController {
  constructor(private readonly manillasService: ManillasService) {}

  @Post()
  create(@Body() createManillaDto: CreateManillaDto) {
    return this.manillasService.create(createManillaDto);
  }

  @Get()
  findAll() {
    return this.manillasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manillasService.findOne(+id);
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
