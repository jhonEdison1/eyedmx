import { PartialType } from '@nestjs/mapped-types';
import { CreateParametroDto } from './create-parametro.dto';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateParametroDto extends PartialType(CreateParametroDto) {

    @IsNotEmpty({ message: "El valor del parametro es requerido" })
    @ApiProperty({description: "valor del parametro", type: String})
    readonly valor: string;






}
