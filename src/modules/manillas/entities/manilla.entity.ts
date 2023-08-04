import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "src/modules/users/entities/user.entity";

@Schema({ timestamps: true })
export class Manilla extends Document {

    //hace referencia al id del usuario
    // @Prop({ required: true, ref: User }) // Indica que es una referencia a la entidad Usuario
    // userId: Ref<User>; // Tipo especial para definir una referencia


    @Prop({ type: Types.ObjectId, ref: 'User' }) // Establecer la referencia al modelo User
    userId: User; // Nombre del campo para almacenar el objeto completo del usuario

    @Prop({ required: true })
    rh: string;

    @Prop({ required: true, trim: true })
    alergias: string;

    @Prop({ required: true, trim: true })
    contacto_de_emergencia: string;

    @Prop({ required: true, trim: true })
    telefono_de_emergencia: string;

    @Prop({  trim: true })
    qrCode: string;

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


}


export const ManillaSchema = SchemaFactory.createForClass(Manilla);
