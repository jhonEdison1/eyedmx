import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { enviroments } from './common/enviroments';
import config from './config';
import * as Joi from 'joi';
import { UsersModule } from './modules/users/users.module';
import { IamModule } from './modules/iam/iam.module';
import { ErrorsModule } from './modules/errors/errors.module';
import { ManillasModule } from './modules/manillas/manillas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV ?? "prod"],
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
      })
    }),
    DatabaseModule,
    UsersModule,
    ErrorsModule,
    IamModule,
    ManillasModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
