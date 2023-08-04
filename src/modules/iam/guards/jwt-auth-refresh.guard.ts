import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";


@Injectable()
export class JwtAuthRefreshGuard extends AuthGuard("jwt-refresh") {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canACtivate(context: ExecutionContext) {

    // const plan = this.reflector.get<string>("plan", context.getHandler());

    // if (plan) {
    //   const request = context.switchToHttp().getRequest();
    //   const user = request.user;
    //   const hasPlan = () => user.plan === plan;
    //   return user && user.plan && hasPlan();
    // }

    return super.canActivate(context);
  }
}