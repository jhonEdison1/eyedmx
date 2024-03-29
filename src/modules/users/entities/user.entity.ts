import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";




export enum plans {
    Basico = 'Basico',
    Intermedio = 'Intermedio',
    Premium = 'Premium'
    
}


@Schema({ timestamps: true })
export class User extends Document {


    @Prop({ unique: true, index: true, trim: true })
    email: string;

    @Prop({ trim: true })
    password: string;

    @Prop({ trim: true })
    name: string;

    @Prop({ default: "user", trim: true })
    role: string;

    @Prop({ required: true })
    telefono: string;    

    @Prop({ required: true })
    direccion: string;

    @Prop({ required: false, trim:true })
    distribuidor: string;

    // @Prop({ /*required: true*/ })
    // fecha_nacimiento: Date; 
    
    @Prop({default: true})
    aceptado: Boolean;

    @Prop({default: plans.Basico})
    plan: string;

    @Prop({required: false})
    fotoBase64: string;

    @Prop({trim: true})
    tokenreset: string



    // @Prop([{ type: String, enum: ['Motero', 'Niño', 'Adulto_Mayor', 'Mascota'] }])
    // tipo: string[];





}

export const UserSchema = SchemaFactory.createForClass(User);


UserSchema.methods.toJSON = function () {
    const { __v, password, ...record } = this.toObject();
    return record;
}

