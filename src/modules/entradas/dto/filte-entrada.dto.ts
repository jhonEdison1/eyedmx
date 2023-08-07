import { IsOptional, IsPositive, Min } from "class-validator";

export class FilterEntradaDto {

    @IsOptional()
    @IsPositive()
    limit: number;

    @IsOptional()
    @Min(0)
    offset: number;

    @IsOptional()
    placa: string;
   
    

   
}