import { PartialType } from '@nestjs/mapped-types';
import { CreateManillaDto } from './create-manilla.dto';
import { estadoManilla } from "../entities/manilla.entity"
import { IsEnum, IsOptional, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateManillaDto extends PartialType(CreateManillaDto) {

    @IsEnum(estadoManilla)
    @ApiProperty({ description: "estado de la manilla", type: String })
    estado: estadoManilla;
}


export class EditManillaDto {

    // @IsString({ message: "el contacto de emergencia debe contener datos validos" })
    // @IsNotEmpty({ message: "el contacto de emergencia es requerido" })
    // @ApiProperty({description: "nombre de un contacto de emergencia", type: String})  
    readonly contacto_de_emergencia: string;


    // @IsString({ message: "el telefono de emergencia debe contener datos validos" })
    // @IsNotEmpty({ message: "el telefono de emergencia es requerido" })
    // @ApiProperty({description: "telefono de un contacto de emergencia", type: String})  
    readonly telefono_de_emergencia: string;



    // @IsString({ message: "la foto_portador debe contener datos validos" })
    // @IsNotEmpty({ message: "la foto_portador es requerida" })
    // @ApiProperty({description: "foto del portador de la manilla", type: String})
    readonly foto_portador: string;


    @IsOptional()
    readonly licencia: string;

    @IsOptional()
    readonly matricula_o_tarjeta: string;

    @IsOptional()
    readonly factura: string;

    @IsOptional()
    readonly seguro: string;

    @IsOptional()
    readonly tenencias: string;


}



export class EditManillaMoteroDto extends EditManillaDto {


    readonly nombre_portador: string;

    // @IsString({ message: "la marca debe contener caracteres validos" })
    // @IsNotEmpty({ message: "la marca es requerida" })
    // @ApiProperty({description: "marca de la motocicleta", type: String})  
    readonly marca: string;

    // @IsPositive({ message: "el cilindraje debe ser un numero positivo" })
    // @IsNumber({}, { message: "el cilindraje debe ser un numero" })
    // @IsNotEmpty({ message: "el cilindraje es requerido" })
    readonly cilindraje: number;

    // @IsString({ message: "la compañia de seguros debe contener caracteres validos" })
    // @IsNotEmpty({ message: "la compañia de seguros es requerida" })
    readonly compañia_de_seguros: string;

    // @IsString({ message: "el genero del portador de la manilla debe contener caracteres validos" })
    // @IsNotEmpty({ message: "el genero es requerido" })
    readonly genero: string;

    // @IsString({ message: "la placa debe contener caracteres validos" })
    // @IsNotEmpty({ message: "la placa es requerida" })
    readonly placa: string;


    // @IsString({ message: "el rh debe contener datos validos" })
    // @IsNotEmpty({ message: "el rh es requerido" })
    // @ApiProperty({description: "informacion del grupo y tipo sanguineo del portador de la manilla", type: String})  
    readonly rh: string;

    // @IsString({ message: "las alergias caracteres validos" })
    // @IsNotEmpty({ message: "las alergias son requeridas" })
    // @ApiProperty({description: "alergias que pueda presentar el portador de la manilla", type: String})  
    readonly alergias: string;


   

}


export class EditManillaAdulto_MayorDto extends EditManillaDto {


    // @IsString({ message: "el nombre_portador debe contener datos validos" })
    // @IsNotEmpty({ message: "el nombre_portador es requerido" })
    readonly nombre_portador: string;

    // @IsString({ message: "el genero debe contener caracteres validos" })
    // @IsNotEmpty({ message: "el genero es requerido" })
    readonly genero: string;

    // @IsString({ message: "las enfermedades deben contener caracteres validos" })
    // @IsNotEmpty({ message: "las enfermedades son requeridas" })
    readonly enfermedades: string;

    // @IsString({ message: "las recomendaciones deben contener caracteres validos" })
    // @IsNotEmpty({ message: "las recomendaciones son requeridas" })
    readonly recomendaciones: string;

    // @IsString({ message: "el rh debe contener datos validos" })
    // @IsNotEmpty({ message: "el rh es requerido" })
    // @ApiProperty({description: "informacion del grupo y tipo sanguineo del portador de la manilla", type: String})  
    readonly rh: string;

    // @IsString({ message: "las alergias caracteres validos" })
    // @IsNotEmpty({ message: "las alergias son requeridas" })
    // @ApiProperty({description: "alergias que pueda presentar el portador de la manilla", type: String})  
    readonly alergias: string;



}


@ValidatorConstraint({ name: 'customValidation', async: false })
export class AtLeastOneIsRequiredConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const fields = args.constraints as string[];

        for (const field of fields) {
            if ((args.object as any)[field]) {
                return true;
            }
        }

        return false;
    }

    defaultMessage(args: ValidationArguments) {
        const fields = args.constraints as string[];
        return `At least one of '${fields.join("' or '")}' is required.`;
    }
}

export function AtLeastOneIsRequired(fields: string[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'atLeastOneIsRequired',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: fields,
            validator: AtLeastOneIsRequiredConstraint,
        });
    };
}


export class EditManillaNiñoDto extends EditManillaDto {


    // @IsString({ message: "el nombre_portador debe contener datos validos" })
    // @IsNotEmpty({ message: "el nombre_portador es requerido" })
    readonly nombre_portador: string;

    // @IsString({ message: "el genero debe contener caracteres validos" })
    // @IsNotEmpty({ message: "el genero es requerido" })
    readonly genero: string;

    // @IsString({ message: "las enfermedades deben contener caracteres validos" })
    // @IsNotEmpty({ message: "las enfermedades son requeridas" })
    readonly enfermedades: string;

    // @IsString({ message: "las recomendaciones deben contener caracteres validos" })
    // @IsNotEmpty({ message: "las recomendaciones son requeridas" })
    readonly recomendaciones: string;

    @IsOptional()
    readonly nombre_padre: string;

    @IsOptional()
    readonly nombre_madre: string;

    @IsOptional()
    readonly telefono_padre: string;

    @IsOptional()
    readonly telefono_madre: string;

    //@IsNotEmpty()
    @AtLeastOneIsRequired(['nombre_padre', 'nombre_madre'])
    atLeastOneNameIsRequired: string;

    //@IsNotEmpty()
    @AtLeastOneIsRequired(['telefono_padre', 'telefono_madre'])
    atLeastOnePhoneIsRequired: string;


    // @IsString({ message: "el rh debe contener datos validos" })
    // @IsNotEmpty({ message: "el rh es requerido" })
    // @ApiProperty({description: "informacion del grupo y tipo sanguineo del portador de la manilla", type: String})  
    readonly rh: string;

    // @IsString({ message: "las alergias caracteres validos" })
    // @IsNotEmpty({ message: "las alergias son requeridas" })
    // @ApiProperty({description: "alergias que pueda presentar el portador de la manilla", type: String})  
    readonly alergias: string;

}


export class EditManillaMascotaDto extends EditManillaDto{

 

    // @IsString({ message: "las enfermedades deben contener caracteres validos" })
    // @IsNotEmpty({ message: "las enfermedades son requeridas" })
    readonly enfermedades: string;

    // @IsString({ message: "la raza debe contener caracteres validos" })
    // @IsNotEmpty({ message: "la raza es requerida" })
    readonly raza: string;

    // @IsString({ message: "el nombre debe contener caracteres validos" })
    // @IsNotEmpty({ message: "el nombre es requerido" })
    readonly nombre_mascota: string;

    //@IsNotEmpty({message: "la fecha de nacimiento de la mascota es requerida"})
    //@IsDate()
    //@Type(() => Date)
    readonly fecha_nacimiento_mascota: Date;


}

