import { PartialType } from '@nestjs/mapped-types';
import { CreateManillaDto } from './create-manilla.dto';
import {estadoManilla} from "../entities/manilla.entity"
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateManillaDto extends PartialType(CreateManillaDto) {

    @IsEnum(estadoManilla)
    @ApiProperty({description: "estado de la manilla", type: String})
    estado: estadoManilla;   



}
