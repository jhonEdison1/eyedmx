import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthenticationCommonService } from "../authentication/authentication.common.service";
import { User } from "src/modules/users/entities/user.entity";
import { SignInDto } from "../authentication/dto/signin-auth.dto";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {

    constructor(
        private readonly authenticationCommonService: AuthenticationCommonService
    ) {
        super({
            usernameField: "email",
            passwordField: "password"
        })
    }

    async validate(email: string, password: string) : Promise<User> {
        const payload : SignInDto = {email, password};
        const user = await this.authenticationCommonService.findUserToAuthenticate(payload);
        return user;
    }

}