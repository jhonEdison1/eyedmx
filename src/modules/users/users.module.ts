import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { HashingService } from 'src/providers/hashing/hashing.service';
import { BcryptService } from 'src/providers/hashing/bcrypt.service';
import { ErrorsModule } from '../errors/errors.module';
import { IamModule } from '../iam/iam.module';
import { ManillasModule } from '../manillas/manillas.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),    
    ErrorsModule,
    IamModule,
    ManillasModule,
    ConfigModule,
    MailModule   
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService
      
    },
    UsersService
  ],
  exports: [UsersService]
})
export class UsersModule {}
