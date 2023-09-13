import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsPositive, Min } from "class-validator";
import { estadoPago, metodoPago } from "../entities/pago.entity";


export class FilterPagoDto{

    // //@IsNotEmpty()
    // @IsIn(Object.values(metodoPago))
    @IsOptional()
     metodo: string;

    // //@IsNotEmpty()
    // @IsIn(Object.values(estadoPago))
    @IsOptional()
    estado: string;

    @IsNumber()
    @Min(0)
    offset: number;

    @IsNumber()
    @IsPositive()
    @Min(1)
    limit: number;

}

