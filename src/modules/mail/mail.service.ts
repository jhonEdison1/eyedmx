import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {

    constructor(
        private mailerService: MailerService
       
      ) { }


      async sendQrCodeEmail(email: string, qrCode: string, nameuser: string) {      

        let name = 'qrcodemanilla';        
        await this.mailerService.sendMail({
          to: email, // list of receivers
          // from: '"Support Team" <support@example.com>', // override default from
          subject: 'Pulsera Aprobada!',
          template: name, // `.hbs` extension is appended automatically
          context: { // ✏️ filling curly brackets with content
            name: nameuser,
            qrcode: qrCode            
          },
        });
        
      }

      async sendPulseraEnviada(email: string, nameuser: string){

        let name = 'pulseraenviada';
        await this.mailerService.sendMail({
          to: email, // list of receivers
          subject: 'Pulsera Enviada!',
          template: name, // `.hbs` extension is appended automatically
          context: { // ✏️ filling curly brackets with content
            name: nameuser,
          },
        });

      }


      async sendPulseraEntregada(email: string, nameuser: string){

        let name = 'pulseraentregada';
        await this.mailerService.sendMail({
          to: email, // list of receivers
          subject: 'Pulsera Entregada!',
          template: name, // `.hbs` extension is appended automatically
          context: { // ✏️ filling curly brackets with content
            name: nameuser,
          },
        });
      }


      async sendCorreoBienvenida(email: string, nameuser: string){

        let name = 'correobienvenida';

        await this.mailerService.sendMail({
          to: email, // list of receivers
          subject: 'Bienvenido a EyedMx!',
          template: name, // `.hbs` extension is appended automatically
          context: { // ✏️ filling curly brackets with content
            name: nameuser,
          },
        });
      }


}
