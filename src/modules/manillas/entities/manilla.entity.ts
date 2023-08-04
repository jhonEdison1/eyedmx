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

    @Prop({ default: null, trim: true })
    qrCode: string;

    @Prop({ default: null, trim: true })
    marca: string;

    @Prop({ default: null, trim: true })
    cilindraje: number;

    @Prop({ default: null, trim: true })
    compañia_de_seguros: string;

    @Prop({ default: null, trim: true })
    genero: string;

    @Prop({ default: null, trim: true })
    placa: string;

    @Prop({ default: null, trim: true })
    enfermedades: string;

    @Prop({ default: null, trim: true })
    recomendaiones: string;

    @Prop({ default: null, trim: true })
    nombre_padre: string;

    @Prop({ default: null, trim: true })
    nombre_madre: string;

    @Prop({ default: null, trim: true })
    telefono_padre: string;

    @Prop({ default: null, trim: true })
    telefono_madre: string;

    @Prop({ default: null, trim: true })
    raza: string;

    @Prop({ default: null, trim: true })
    nombre_mascota: string;

    @Prop({ default: null, trim: true })
    fecha_nacimiento_mascota: Date;


}


export const ManillaSchema = SchemaFactory.createForClass(Manilla);
