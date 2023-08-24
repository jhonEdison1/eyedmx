import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthenticationCommonService } from './authentication.common.service';
import { Request } from 'express';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { User } from 'src/modules/users/entities/user.entity';
import { AuthenticationService } from './authentication.service';
import { JwtAuthRefreshGuard } from '../guards/jwt-auth-refresh.guard';
import { ResetPasswordDto } from './dto/reset-passwor.dto';

@ApiTags("Auth")
@Controller("authentication")
export class AuthenticationController {

    constructor(
        private readonly authenticationCommonService: AuthenticationCommonService,
        private readonly authService: AuthenticationService

    ) { }




    @UseGuards(LocalAuthGuard)
    @Post("signin")
    async signIn(@Req() req: Request) {
      const user = req.user as User;
      //const tfaCode = req.body.tfaCode || null;
  
      return await this.authService.signIn(user/*, tfaCode*/);
      
    }

    @Get("forgotpassword")
    async forgotPassword(@Query("email") email: string) {
      return await this.authService.forgotPassword(email);
    }

    @Post("resetpassword")
    async resetPassword(@Body() body: ResetPasswordDto) {
      return await this.authService.resetPassword(body.token, body.password);
    }

    
    @UseGuards(JwtAuthRefreshGuard)
    @Get("refresh")
    async refreshToken(@Req() req: Request) {
      const user = req.user as User;
      const refreshToken = req.headers.authorization.split(" ")[1];  
      return await this.authService.generateNewAccessToken(user, refreshToken);
    }


    @Get("fields")
    @ApiQuery({ name: "type", required: true })
    async getFields(@Query("type") type: string) {
      return await this.authenticationCommonService.getFields(type);
    }


    @Get("types")
    async getTypes() {
      return await this.authenticationCommonService.getTypes();
    }

    




}
