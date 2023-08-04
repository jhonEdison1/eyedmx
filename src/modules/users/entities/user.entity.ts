import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema({ timestamps: true})
export class User extends Document {


    @Prop( {unique: true, index: true, trim: true})
    email: string;
    @Prop({trim: true})
    password: string;
    @Prop({trim: true})
    name: string;
    @Prop({default:  "user", trim: true})
    role: string;


}

export const UserSchema = SchemaFactory.createForClass(User);


UserSchema.methods.toJSON = function () {
    const {__v, password,  ...record} = this.toObject();
    return record;
}

