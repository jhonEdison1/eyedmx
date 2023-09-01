import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Manilla } from "src/modules/manillas/entities/manilla.entity";
import { User } from "src/modules/users/entities/user.entity";


export enum metodoPago {
    Stripe = 'Stripe',
    Efectivo = 'Efectivo',
}

export enum estadoPago {
    success = 'success',
    wait = 'wait',
    fail = 'fail',
}

@Schema({ timestamps: true })
export class Pago {


    @Prop({ type: Types.ObjectId, ref: 'User' })
    userId: User;


    @Prop({ required: true, trim: true })
    monto: number;

    @Prop({
        required: true,
        trim: true,
        validate: {
          validator: (value) => Object.values(metodoPago).includes(value),
          message: props => `${props.value} is not a valid payment method 1`,
        },
      })
    metodo: metodoPago;

    @Prop({ default: estadoPago.wait, required: true })
    estado: estadoPago;

    @Prop({ trim: true, nullable: true, default: null })
    stripeId: string; 


    @Prop({type: Types.ObjectId, ref: 'Manilla'})
    manillaId: Manilla;
}


export const PagoSchema = SchemaFactory.createForClass(Pago);
