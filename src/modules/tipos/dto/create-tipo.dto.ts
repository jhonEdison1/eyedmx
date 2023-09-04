import { IsIn, IsNotEmpty, IsNumber, IsPositive,  } from "class-validator";
import { Tipos } from "src/modules/iam/authentication/authentication.common.service";




export class CreateTipoDto {



    @IsNotEmpty()
    @IsIn(Object.values(Tipos))
    nombre: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    precio: number;



}
