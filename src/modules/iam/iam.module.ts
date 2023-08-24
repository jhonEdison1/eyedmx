import { Module } from '@nestjs/common';
import { AuthenticationCommonService, AuthenticationController } from './authentication';
import { ErrorsModule } from '../errors/errors.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/entities/user.entity';
import { HashingService } from 'src/providers/hashing/hashing.service';
import { BcryptService } from 'src/providers/hashing/bcrypt.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import config from 'src/config';
import { JwtAccessTokenStrategy } from './strategies/jwt-auth-access.strategy';
import { AuthenticationService } from './authentication/authentication.service';
import { JwtRefreshTokenStrategy } from './strategies/jwt-auth-refresh.strategy ';
import { MailModule } from '../mail/mail.module';


@Module({
  imports: [
    ErrorsModule,
    MailModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [config.KEY],
      useFactory: async (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.session.jwtAccessTokenSecret,
          signOptions: {
            expiresIn: configService.session.jwtAccessTokenExpiresTime,
          },
        };
      },

    })
  ],
  providers:[
    { provide: HashingService, useClass: BcryptService },
    AuthenticationCommonService,
    AuthenticationService,
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationCommonService, AuthenticationService],
})
export class IamModule {}
