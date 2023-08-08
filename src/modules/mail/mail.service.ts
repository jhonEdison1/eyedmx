import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {

    constructor(
        private mailerService: MailerService
       
      ) { }


      async sendQrCodeEmail(email: string, qrCode: string, nameuser: string) {

        console.log('qr', qrCode )

       

        let name = 'qrcodemanilla';
        
    
       
        await this.mailerService.sendMail({
          to: email, // list of receivers
          // from: '"Support Team" <support@example.com>', // override default from
          subject: 'Manilla Aprobada!',
          template: name, // `.hbs` extension is appended automatically
          context: { // ✏️ filling curly brackets with content
            name: nameuser,
            qrcode: qrCode            
          },
        });
        
      }


}
