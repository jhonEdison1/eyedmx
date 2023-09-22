import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {  Document } from "mongoose";


@Schema({ timestamps: true })
export class Parametro extends Document {

    @Prop({ required: true, trim: true, unique: true })
    nombre: string;


    @Prop({ required: true, trim: true })
    valor: string;

    

}




export const ParametroSchema = SchemaFactory.createForClass(Parametro);
