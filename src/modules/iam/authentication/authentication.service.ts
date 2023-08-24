import { ConflictException, Injectable } from "@nestjs/common";
import { AuthenticationCommonService } from "./authentication.common.service";
import { ErrorsService } from "src/modules/errors/errors.service";
import { SigninPayload } from "../models/signin.model";
import { PayloadToken } from "../models/token.model";



@Injectable()
export class AuthenticationService {
    constructor(
        private readonly authcommonService: AuthenticationCommonService,
        private readonly errorService: ErrorsService,
        //private readonly otpAuthenticationService: OtpAuthenticationService
    ) { }

    async signIn(payload: SigninPayload) {

        try {

            const isAceppted = await this.authcommonService.isAcepted(payload.id);
            if (!isAceppted) {
                throw new Error("El usuario no ha sido aceptado");
            }



            const data: PayloadToken = { id: payload.id, role: payload.role };

            const [accessToken, refreshToken] = await Promise.all([
                this.authcommonService.generateJwtAccessToken(data),
                this.authcommonService.generateJwtRefreshoken(data)
            ]);

            return {
                message: "Acceso autorizado",
                accessToken,
                refreshToken,
                user: payload
            };


        } catch (error) {
            this.errorService.createError(error);


        }

    }

    async generateNewAccessToken(payload: SigninPayload, refreshToken: string) {
        try {
            /** Data para generar el access y refresh Token */
            const data: PayloadToken = { id: payload.id, role: payload.role };

            const accesstoken = await this.authcommonService.generateJwtAccessToken(data);
            const user = await this.authcommonService.findUserAutenticated(payload.id);
            return {
                message: "Acceso autorizado",
                accesstoken,
                refreshToken,
                user
            };
        } catch (error) {
            this.errorService.createError(error);
        }
    }





    async forgotPassword(email: string) {
        try {
            const user = await this.authcommonService.findUserByEmail(email);
            if (!user) {
                throw new Error("El usuario no existe");
            }
            const token = await this.authcommonService.generateTokenForgotPassword(user.id);
            await this.authcommonService.sendEmailForgotPassword(user.email, token); 

            await this.authcommonService.updateTokenReset(user.id, token)

            
            
            
            return {
                message: "Se ha enviado un correo con el codigo de verificacion"
            };
        } catch (error) {
            this.errorService.createError(error);
        }
    }


    async resetPassword(token: string, password: string) {

        try {

            if(!token || !password  || token === "" || password === ""  || token === undefined || password === undefined || token === null || password === null){
                throw new ConflictException("Faltan datos");

            }

            const user = await this.authcommonService.findUserByTokenReset(token);
            if (!user) {
                throw new Error("El usuario no existe");
            }

            await this.authcommonService.resetPassword(user.id, password);

            await this.authcommonService.updateTokenReset(user.id, null)

            return {
                message: "Se ha cambiado la contraseña"
            };

        } catch (error) {
            this.errorService.createError(error);
        }


    }


}