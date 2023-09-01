import { IsIn, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";
import { metodoPago } from "../entities/pago.entity";

export class CreatePagoDto {


    @IsNotEmpty()
    @IsMongoId()
    userId: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    monto: number;


    @IsNotEmpty()
    @IsIn(Object.values(metodoPago))
    metodo: string;
    

    @IsOptional()
    stripeId: string;

    @IsNotEmpty()
    @IsMongoId()
    manillaId: string;



}
