import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class ResetPasswordDto {

    @IsNotEmpty({ message: "Envie un token valido" })
    @ApiProperty()
    readonly token: string;
  
    @IsNotEmpty({ message: "Por favor ingrese una contraseña válida" })
    @ApiProperty()
    readonly password: string;
}