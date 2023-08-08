

import {IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {

    @IsString()
    @IsNotEmpty()
    readonly oldpassword: string;

    @IsString()
    @IsNotEmpty()
    readonly newPassword: string;

   
}