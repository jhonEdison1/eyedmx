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
    foto_portador: string;


    @IsOptional()
    licencia: string;

    @IsOptional()
    matricula_o_tarjeta: string;

    @IsOptional()
    factura: string;

    @IsOptional()
    seguro: string;

    @IsOptional()
    tenencias: string;

    @IsOptional()
     historia_clinica: string;

    @IsOptional()
     archivos: string;

    @IsOptional()
    otros: object;


}



export class EditManillaMoteroDto extends EditManillaDto {



    readonly nombre_portador: string;


    readonly documento: string;

    @IsOptional()
    readonly fecha_nacimiento: Date;


    readonly genero: string;

    @IsOptional()
    readonly email: string;


    readonly direccion: string;

    readonly telefono: string;


    readonly rh: string;


    readonly alergias: string;



    @IsOptional()
    readonly marca: string;

    @IsOptional()
    readonly cilindraje: number;

    @IsOptional()
    readonly compañia_de_seguros: string;

    @IsOptional()
    readonly centro_de_salud: string;


    readonly placa: string;




}


export class EditManillaAdulto_MayorDto extends EditManillaDto {



    readonly nombre_portador: string;

    @IsOptional()
    readonly documento: string;


    readonly fecha_nacimiento: Date;


    readonly genero: string;

    @IsOptional()
    readonly email: string;


    readonly direccion: string;


    readonly telefono: string;

    readonly rh: string;


    readonly alergias: string;


    readonly enfermedades: string;


    readonly centro_de_salud: string;


    readonly recomendaciones: string;


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


    readonly nombre_portador: string;

    @IsOptional()
    readonly documento: string;


    readonly fecha_nacimiento: Date;


    readonly genero: string;

    @IsOptional()
    readonly email: string;


    readonly direccion: string;


    readonly telefono: string;


    readonly rh: string;



    readonly alergias: string;


    readonly enfermedades: string;

    @IsOptional()
    readonly centro_de_salud: string;

    @IsOptional()
    readonly recomendaciones: string;

    @IsOptional()
    readonly nombre_padre: string;

    @IsOptional()
    readonly nombre_madre: string;

    @IsOptional()
    readonly telefono_padre: string;

    @IsOptional()
    readonly telefono_madre: string;

    // //@IsNotEmpty()
    // @AtLeastOneIsRequired(['nombre_padre', 'nombre_madre'])
    // atLeastOneNameIsRequired: string;

    // //@IsNotEmpty()
    // @AtLeastOneIsRequired(['telefono_padre', 'telefono_madre'])
    // atLeastOnePhoneIsRequired: string;

}


export class EditManillaMascotaDto extends EditManillaDto {



    readonly nombre_duenio: string;


    readonly nombre_mascota: string;

    @IsOptional()
    readonly email: string;

    readonly direccion: string;


    readonly telefono: string;


    readonly enfermedades: string;

    @IsOptional()
    readonly centro_de_salud: string;

    readonly fecha_nacimiento_mascota: Date;


    readonly raza: string;


}



export class EditManillaDeportistaDto extends EditManillaDto {



    readonly nombre_portador: string;


    readonly documento: string;

    @IsOptional()
    readonly fecha_nacimiento: Date;


    readonly genero: string;

    @IsOptional()
    readonly email: string;


    readonly direccion: string;

    readonly telefono: string;


    readonly rh: string;


    readonly alergias: string;



    @IsOptional()
    readonly deporte: string;


    @IsOptional()
    readonly compañia_de_seguros: string;

    @IsOptional()
    readonly centro_de_salud: string;






}


