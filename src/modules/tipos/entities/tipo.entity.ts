import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import  { Document, Types } from "mongoose";
import { Tipos } from "src/modules/iam/authentication/authentication.common.service";






@Schema({timestamps: true})
export class Tipo extends Document {

    @Prop({required: true, trim: true})
    nombre: Tipos;

    @Prop({required: true, trim: true})
    precio: number;
}

export const TipoSchema = SchemaFactory.createForClass(Tipo);
