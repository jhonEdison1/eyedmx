import { IsIn, IsNotEmpty, IsNumber, IsPositive, Min } from "class-validator";
import { estadoPago, metodoPago } from "../entities/pago.entity";


export class FilterPagoDto{

    // //@IsNotEmpty()
    // @IsIn(Object.values(metodoPago))
    // metodo: string;

    // //@IsNotEmpty()
    // @IsIn(Object.values(estadoPago))
    // estado: string;

    @IsNumber()
    @Min(0)
    offset: number;

    @IsNumber()
    @IsPositive()
    @Min(1)
    limit: number;

}

