import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import config from 'src/config';




@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [config.KEY],
      useFactory: async (configService: ConfigType<typeof config>) => ({
        transport: {
          host: configService.mail.host,
          secure: true,
          auth: {
            user: configService.mail.user,
            pass: configService.mail.pass
          }
        },
        defaults: {
          from: `"EyedMx no reply" <${configService.mail.from}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },

      }),      
    }),
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule { }
