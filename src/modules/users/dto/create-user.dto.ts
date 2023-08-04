import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsOptional } from "class-validator";

export class CreateUserDto {

    
    @IsEmail({}, {message: "El campo debe ser un email válido"})
    @IsNotEmpty({message: "El email es requerido"})
    @ApiProperty({description: "Email del usuario", type: String})  
    readonly email: string;

    @IsString({message: "La contraseña debe contener caracteres válidos"})
    @IsNotEmpty({message: "La contraseña es requerida"})
    @MinLength(6, {message: "La contraseña debe contener al menos 6 caracteres"})
    @MaxLength(20, {message: "La contraseña debe contener menos de 20 caracteres"})
    @ApiProperty({description: "Contraseña del usuario", type: String})
    password: string;


    @IsString({message: "El nombre debe contener caracteres válidos"})
    @IsNotEmpty({message: "El nombre es requerido"})
    @MinLength(3, {message: "El nombre debe contener al menos 3 caracteres"})
    @ApiProperty({description: "Nombre del usuario", type: String})
    readonly name: string;

    @IsString({message: "El rol debe contener caracteres válidos"})
    @IsOptional()
    @ApiProperty({description: "Rol del usuario", type: String})
    readonly role: string;
}
