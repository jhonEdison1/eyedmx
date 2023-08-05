import { IsOptional, IsPositive, Min } from "class-validator";
import { estadoManilla } from "../entities/manilla.entity";
import { Tipos } from "src/modules/iam/authentication/authentication.common.service";

export class FilterManillaDto {

    @IsOptional()
    @IsPositive()
    limit: number;

    @IsOptional()
    @Min(0)
    offset: number;

    @IsOptional()
    estado: estadoManilla;

    @IsOptional()
    tipo: Tipos;

    

   
}