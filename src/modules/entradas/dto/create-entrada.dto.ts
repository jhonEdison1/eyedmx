import { IsNotEmpty, IsString } from "class-validator";

export class CreateEntradaDto {
    @IsString({ message: "las observaciones deben contener caracteres validos" })
    @IsNotEmpty({ message: "las observaciones son requeridas" })
    observaciones: string;

}



export class InfoEntradaDto {

    @IsString({ message: "el taller debe contener caracteres validos" })
    @IsNotEmpty({ message: "el taller es requerido" })
    taller: string;

    @IsString({ message: "las observaciones deben contener caracteres validos" })
    @IsNotEmpty({ message: "las observaciones son requeridas" })
    observaciones: string;


    @IsString({ message: "la placa debe contener caracteres validos" })
    @IsNotEmpty({ message: "la placa es requerida" })
    placa: string;

    @IsString({ message: "la manilla debe contener caracteres validos" })
    @IsNotEmpty({ message: "la manilla es requerida" })
    manilla: string;




}

