import { IsIn, IsNotEmpty } from "class-validator";
import { estadoPago } from "../entities/pago.entity";

export class EstadoPagoDto {

    @IsNotEmpty()
    @IsIn(Object.values(estadoPago))
    estado: string;

}
