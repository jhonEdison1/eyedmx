import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsOptional, IsDate } from "class-validator";




export class CreateUserTallerDto {

    
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

    @IsString({message: "El telefono debe contener caracteres válidos"})
    @IsNotEmpty({message: "El telefono es requerido"})
    @MinLength(10, {message: "El telefono debe contener al menos 10 caracteres"})
    @ApiProperty({description: "Telefono del usuario", type: String})
    telefono: string;

    @IsString({message: "La dirección debe contener caracteres válidos"})
    @IsNotEmpty({message: "La dirección es requerida"})
    @ApiProperty({description: "Dirección del usuario", type: String})
    direccion: string;


    @IsOptional()
    @ApiProperty({description: "Foto del usuario", type: String})
    fotoBase64: string;

    // @IsString({message: "El documento debe contener caracteres válidos"})
    // @IsNotEmpty({message: "El documento es requerido"})
    // @ApiProperty({description: "Documento del usuario", type: String})
    // documento: string;

    // @IsNotEmpty({message: "la fecha de nacimiento es requerida"})
    // @IsDate()
    // @Type(() => Date)
    // @ApiProperty({description: "Fecha de nacimiento del usuario", type: Date})
    // fecha_nacimiento: Date;

    // @IsArray()
    // @ArrayNotEmpty()
    // @IsEnum(['Motero', 'Niño', 'Adulto_Mayor', 'Mascota'], { each: true })
    // tipo: string[];
    
    // @IsNotEmpty()
    // //@ValidateNested()
    // datosAdicionales: ManillaMoteroDto | ManillaNiñoDto | ManillaAdulto_MayorDto | ManillaMascotaDto;



    



}




