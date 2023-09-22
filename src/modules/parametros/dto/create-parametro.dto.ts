import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";



export class CreateParametroDto {


    @IsNotEmpty({ message: "El nombre del parametro es requerido" })
    @ApiProperty({description: "nombre del parametro", type: String})  
    readonly nombre: string;


    @IsNotEmpty({ message: "El valor del parametro es requerido" })
    @ApiProperty({description: "valor del parametro", type: String})
    readonly valor: string;

}
