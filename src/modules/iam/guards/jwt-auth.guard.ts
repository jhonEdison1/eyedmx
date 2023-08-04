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

        // const plan = this.reflector.get<string>("plan", context.getHandler());

        // if (plan) {
        //     const request = context.switchToHttp().getRequest();
        //     const user = request.user;
        //     const hasPlan = () => user.plan === plan;
        //     return user && user.plan && hasPlan();
        // }


        return super.canActivate(context);

    }

}
