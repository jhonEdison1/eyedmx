import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthAccessGuard extends AuthGuard("jwt-access") {

    constructor(
        private readonly reflector: Reflector

    ) {
        super();
    }


    canActivate(context: ExecutionContext) {    


        return super.canActivate(context);

    }

}
