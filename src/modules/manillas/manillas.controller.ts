import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ManillasService } from './manillas.service';
import { CreateManillaDto } from './dto/create-manilla.dto';
import { UpdateManillaDto } from './dto/update-manilla.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthAccessGuard } from '../iam/guards/jwt-auth.guard';

@ApiTags("manillas")
@Controller('manillas')
export class ManillasController {
  constructor(private readonly manillasService: ManillasService) {}

  @Post('solicitar')
  @UseGuards(JwtAuthAccessGuard)
  create(@Body() createManillaDto: CreateManillaDto,  @Request() req) {   
   
    return this.manillasService.createManilla(createManillaDto, req.user.id);
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
