import { Injectable } from "@nestjs/common";
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


}