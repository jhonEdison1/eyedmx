import { IsIn, IsNotEmpty } from "class-validator";
import { estadoPago, metodoPago } from "../entities/pago.entity";


export class FilterPagoDto{

    //@IsNotEmpty()
    @IsIn(Object.values(metodoPago))
    metodo: string;

    //@IsNotEmpty()
    @IsIn(Object.values(estadoPago))
    estado: string;

}