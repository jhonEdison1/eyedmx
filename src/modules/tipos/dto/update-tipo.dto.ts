import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoDto } from './create-tipo.dto';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class UpdateTipoDto  {

    @IsNumber()
    @IsPositive()
    precio: number;

    @IsString()
    description: string;



}
