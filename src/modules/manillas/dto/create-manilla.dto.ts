import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsOptional, IsPhoneNumber, IsPositive, IsString, ValidateIf, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";

export class CreateManillaDto {

    @IsMongoId({ message: "El id del usuario debe ser válido" })
    @IsNotEmpty({ message: "El id del usuario es requerido" })
    @ApiProperty({description: "Id del usuario", type: String})  
    userId: string;
   

    @IsString({ message: "el contacto de emergencia debe contener datos validos" })
    @IsNotEmpty({ message: "el contacto de emergencia es requerido" })
    @ApiProperty({description: "nombre de un contacto de emergencia", type: String})  
    readonly contacto_de_emergencia: string;


    @IsString({ message: "el telefono de emergencia debe contener datos validos" })
    @IsNotEmpty({ message: "el telefono de emergencia es requerido" })
    @ApiProperty({description: "telefono de un contacto de emergencia", type: String})  
    readonly telefono_de_emergencia: string;    


    @IsString({ message: "el tipo debe contener datos validos" })
    @IsNotEmpty({ message: "el tipo es requerido" })
    @ApiProperty({description: " tipo  del portador de la manilla", type: String})  
    tipo: string;

    // @IsString({ message: "la foto_portador debe contener datos validos" })
    // @IsNotEmpty({ message: "la foto_portador es requerida" })
    // @ApiProperty({description: "foto del portador de la manilla", type: String})
    readonly foto_portador: string;



    @IsOptional()
    color : string;


    @IsOptional()
    readonly licencia: string;

    @IsOptional()
    readonly matricula_o_tarjeta : string;

    @IsOptional()
    readonly factura: string;

    @IsOptional()
    readonly seguro: string;

    @IsOptional()
    readonly tenencias: string;



    @IsOptional()
    pagoId: string;

    @IsOptional()
    otros: object



   

}


export class ManillaMoteroDto extends CreateManillaDto {

    // @IsString({ message: "el nombre_portador debe contener datos validos" })
    // @IsNotEmpty({ message: "el nombre_portador es requerido" })
    @IsOptional()
    readonly nombre_portador: string;

    // @IsString({ message: "el diocumento debe contener datos validos" })
    // @IsNotEmpty({ message: "el documento es requerido" })
    @IsOptional()
    readonly documento: string;

    @IsOptional()
    readonly fecha_nacimiento: Date;

    // @IsString({ message: "el genero del portador de la pulsera debe contener caracteres validos" })
    // @IsNotEmpty({ message: "el genero es requerido" })
    @IsOptional()
    readonly genero: string; 

    @IsOptional()
    readonly email: string;

    // @IsString({ message: "la direccion debe contener caracteres validos" })
    // @IsNotEmpty({ message: "la direccion es requerida" })
    @IsOptional()
    readonly direccion: string;

    // @IsPhoneNumber('MX', { message: "el telefono debe contener caracteres validos" })
    // @IsNotEmpty({ message: "el telefono es requerido" })
    @IsOptional()
    readonly telefono: string;

    // @IsString({ message: "el rh debe contener datos validos" })
    // @IsNotEmpty({ message: "el rh es requerido" })
    // @ApiProperty({description: "informacion del grupo y tipo sanguineo del portador de la pulsera", type: String})  
    @IsOptional()
    readonly rh: string;

    // @IsString({ message: "las alergias caracteres validos" })
    // @IsNotEmpty({ message: "las alergias son requeridas" })
    // @ApiProperty({description: "alergias que pueda presentar el portador de la pulsera", type: String})  
    @IsOptional()
    readonly alergias: string;



    @IsOptional()
    readonly marca: string;

    @IsOptional()
    readonly cilindraje: number;

    @IsOptional()
    readonly compañia_de_seguros: string;

    @IsOptional()
    readonly centro_de_salud: string;   

    // @IsString({ message: "la placa debe contener caracteres validos" })
    // @IsNotEmpty({ message: "la placa es requerida" })
    @IsOptional()
    readonly placa: string;


    

   


   

}


export class ManillaAdulto_MayorDto extends CreateManillaDto {


    // @IsString({ message: "el nombre_portador debe contener datos validos" })
    // @IsNotEmpty({ message: "el nombre_portador es requerido" })
    @IsOptional()
    readonly nombre_portador: string;

    @IsOptional()
    readonly documento: string;

    // @IsNotEmpty({message: "la fecha de nacimiento del portador de la pulsera es requerida"})
    @IsOptional()
    readonly fecha_nacimiento: Date;

    // @IsString({ message: "el genero debe contener caracteres validos" })
    // @IsNotEmpty({ message: "el genero es requerido" })
    @IsOptional()
    readonly genero: string;

    @IsOptional()
    readonly email: string;

    // @IsString({ message: "la direccion debe contener caracteres validos" })
    // @IsNotEmpty({ message: "la direccion es requerida" })
    @IsOptional()
    readonly direccion: string;

    // @IsPhoneNumber('MX', { message: "el telefono debe contener caracteres validos" })
    // @IsNotEmpty({ message: "el telefono es requerido" })
    @IsOptional()
    readonly telefono: string;

    // @IsString({ message: "el rh debe contener datos validos" })
    // @IsNotEmpty({ message: "el rh es requerido" })
    // @ApiProperty({description: "informacion del grupo y tipo sanguineo del portador de la pulsera", type: String})  
    @IsOptional()
    readonly rh: string;

    // @IsString({ message: "las alergias caracteres validos" })
    // @IsNotEmpty({ message: "las alergias son requeridas" })
    // @ApiProperty({description: "alergias que pueda presentar el portador de la pulsera", type: String})  
    @IsOptional()
    readonly alergias: string;

    // @IsString({ message: "las enfermedades deben contener caracteres validos" })
    // @IsNotEmpty({ message: "las enfermedades son requeridas" })
    @IsOptional()
    readonly enfermedades: string;

    // @IsString({ message: "el centro de salud debe contener caracteres validos" })
    // @IsNotEmpty({ message: "el centro de saud es requerido" })
    @IsOptional()
    readonly centro_de_salud: string;   

    // @IsString({ message: "las recomendaciones deben contener caracteres validos" })
    // @IsNotEmpty({ message: "las recomendaciones son requeridas" })
    @IsOptional()
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


export class ManillaNiñoDto extends CreateManillaDto {


    // @IsString({ message: "el nombre_portador debe contener datos validos" })
    // @IsNotEmpty({ message: "el nombre_portador es requerido" })
    @IsOptional()
    readonly nombre_portador: string;

    @IsOptional()
    readonly documento: string;

    @IsOptional()
    readonly fecha_nacimiento: Date;

    // @IsString({ message: "el genero debe contener caracteres validos" })
    // @IsNotEmpty({ message: "el genero es requerido" })
    @IsOptional()
    readonly genero: string;

    @IsOptional()
    readonly email: string;

    // @IsString({ message: "la direccion debe contener caracteres validos" })
    // @IsNotEmpty({ message: "la direccion es requerida" })
    readonly direccion: string;

    // @IsPhoneNumber('MX', { message: "el telefono debe contener caracteres validos" })
    // @IsNotEmpty({ message: "el telefono es requerido" })
    @IsOptional()
    readonly telefono: string;

    // @IsString({ message: "el rh debe contener datos validos" })
    // @IsNotEmpty({ message: "el rh es requerido" })
    // @ApiProperty({description: "informacion del grupo y tipo sanguineo del portador de la pulsera", type: String})  
    @IsOptional()
    readonly rh: string;

    
    // @IsString({ message: "las alergias caracteres validos" })
    // @IsNotEmpty({ message: "las alergias son requeridas" })
    // @ApiProperty({description: "alergias que pueda presentar el portador de la pulsera", type: String})  
    @IsOptional()
    readonly alergias: string;

    // @IsString({ message: "las enfermedades deben contener caracteres validos" })
    // @IsNotEmpty({ message: "las enfermedades son requeridas" })
    @IsOptional()
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
    // // @AtLeastOneIsRequired(['nombre_padre', 'nombre_madre'])
    
    // atLeastOneNameIsRequired: string;

    // //@IsNotEmpty()
    // @AtLeastOneIsRequired(['telefono_padre', 'telefono_madre'])
    // atLeastOnePhoneIsRequired: string;


    


}


export class ManillaMascotaDto extends CreateManillaDto{

    // @IsString({ message: "el nombre del dueño debe contener datos validos" })
    // @IsNotEmpty({ message: "el nombre del dueño es requerido" })
    @IsOptional()
    readonly nombre_duenio: string;

    // @IsString({ message: "el nombre debe contener caracteres validos" })
    // @IsNotEmpty({ message: "el nombre es requerido" })
    @IsOptional()
    readonly nombre_mascota: string;

    @IsOptional()
    readonly email: string;

    // @IsString({ message: "la direccion debe contener caracteres validos" })
    // @IsNotEmpty({ message: "la direccion es requerida" })
    @IsOptional()
    readonly direccion: string;

    // @IsPhoneNumber('MX', { message: "el telefono debe contener caracteres validos" })
    // @IsNotEmpty({ message: "el telefono es requerido" })
    @IsOptional()
    readonly telefono: string; 

    @IsOptional()
    readonly enfermedades: string;      

    @IsOptional()
    readonly centro_de_salud: string;   

    //@IsNotEmpty({message: "la fecha de nacimiento de la mascota es requerida"})
    //@IsDate()
    //@Type(() => Date)
    @IsOptional()
    readonly fecha_nacimiento_mascota: Date;

    // @IsString({ message: "la raza debe contener caracteres validos" })
    // @IsNotEmpty({ message: "la raza es requerida" })
    @IsOptional()
    readonly raza: string;




}



//las entradas seran un array que guardara objetos de esta manera  [{taller: 'id', observaciones: 'texto'}], no hace referencia a ningun modelo

// export class CreateEntradaDto {

//     // @IsString({ message: "el taller debe contener caracteres validos" })
//     // @IsNotEmpty({ message: "el taller es requerido" })
//     // taller: string;

//     @IsString({ message: "las observaciones deben contener caracteres validos" })
//     @IsNotEmpty({ message: "las observaciones son requeridas" })
//     observaciones: string;
// }








