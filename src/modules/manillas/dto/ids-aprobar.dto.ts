import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, MinLength } from "class-validator";
import { array } from "joi";



export class IdsAprobarDto {

   
    
    @ApiProperty({description: "ids de las manillas", type: array})
    @IsArray()  
    @ArrayMinSize(1)  
    ids: string[];

  



   

}