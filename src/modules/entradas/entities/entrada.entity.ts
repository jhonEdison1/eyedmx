import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { User } from "src/modules/users/entities/user.entity";

@Schema({ timestamps: true })
export class Entrada {





    @Prop({ type: Types.ObjectId, ref: 'User' })    
    taller: User;

    @Prop({ required: true, trim: true })
    observaciones: string;

    @Prop({ required: true, trim: true })
    placa: string;

    @Prop({ required: true, trim: true })
    manilla: string; 

}

export const EntradaSchema = SchemaFactory.createForClass(Entrada);


EntradaSchema.methods.toJSON = function () {
    const { __v, manilla, ...record } = this.toObject();
    return record;
}
