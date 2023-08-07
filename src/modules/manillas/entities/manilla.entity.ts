import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "src/modules/users/entities/user.entity";
import { Tipos } from "src/modules/iam/authentication/authentication.common.service";



export enum estadoManilla {
    Solicitada = 'Solicitada',
    Aceptada = 'Aceptada',
    Rechazada = 'Rechazada',
    Enviada = 'Enviada',
    Entregada = 'Entregada',
}

@Schema({ timestamps: true })
export class Manilla extends Document {   

    //comunes

    @Prop({ type: Types.ObjectId, ref: 'User' }) 
    userId: User;   

    @Prop({ required: true, trim: true })
    contacto_de_emergencia: string;

    @Prop({ required: true, trim: true })
    telefono_de_emergencia: string;

    @Prop({ required: true })
    tipo: Tipos;

    @Prop({  trim: true })
    qrCode: string;

    //estado de la manilla
    @Prop({ default: estadoManilla.Solicitada })
    estado: estadoManilla;



    //personalizados
    @Prop({trim: true})
    rh: string;

    @Prop({  trim: true })
    alergias: string;
    
    @Prop({  trim: true })
    marca: string;

    @Prop({  trim: true })
    cilindraje: number;

    @Prop({  trim: true })
    compañia_de_seguros: string;

    @Prop({  trim: true })
    genero: string;

    @Prop({  trim: true })
    placa: string;

    @Prop({  trim: true })
    enfermedades: string;

    @Prop({  trim: true })
    recomendaiones: string;

    @Prop({  trim: true })
    nombre_padre: string;

    @Prop({  trim: true })
    nombre_madre: string;

    @Prop({  trim: true })
    telefono_padre: string;

    @Prop({  trim: true })
    telefono_madre: string;

    @Prop({  trim: true })
    raza: string;

    @Prop({  trim: true })
    nombre_mascota: string;

    @Prop({  trim: true })
    fecha_nacimiento_mascota: Date;

    @Prop({  trim: true })   
    nombre_portador: string;


    //una propiedad que guardara un array de objetos asi [{taller: 'id', observaciones: 'texto'}], no hace referencia a ningun modelo

    @Prop({ type: [{ taller: String, observaciones: String, fecha: Date }] })
    entradas: [{ taller: String, observaciones: String, fecha: Date }];
    





    

   


}


export const ManillaSchema = SchemaFactory.createForClass(Manilla);
