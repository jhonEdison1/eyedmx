import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin-auth.dto';
import { ErrorsService } from 'src/modules/errors/errors.service';
import { HashingService } from 'src/providers/hashing/hashing.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { Model } from 'mongoose';
import { PayloadToken } from '../models/token.model';
import { JwtService } from '@nestjs/jwt';
import config from 'src/config';
import { ConfigType } from '@nestjs/config';
import { MailService } from 'src/modules/mail/mail.service';

export enum Tipos {
  Motero = 'Motociclista',
  Adulto_Mayor = 'Adulto_Mayor',
  Niño = 'Niño',
  Mascota = 'Mascota',
  Deportista = 'Deportista'
}



@Injectable()
export class AuthenticationCommonService {
  constructor(
    @Inject(config.KEY)
    private readonly configSerivce: ConfigType<typeof config>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly errorService: ErrorsService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async isAcepted(id: string) {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new ConflictException('El usuario no existe');
      }
      return user.aceptado;
    } catch (error) {
      this.errorService.createError(error);
    }
  }

  generateJwtAccessToken(payload: PayloadToken) {
    try {
      const accessToken = this.jwtService.signAsync(payload, {
        secret: this.configSerivce.session.jwtAccessTokenSecret,
        expiresIn: this.configSerivce.session.jwtAccessTokenExpiresTime,
      });

      return accessToken;
    } catch (error) {
      this.errorService.createError(error);
    }
  }

  generateJwtRefreshoken(payload: PayloadToken) {
    try {
      const refreshToken = this.jwtService.signAsync(payload, {
        secret: this.configSerivce.session.jwtRefreshTokenSecret,
        expiresIn: this.configSerivce.session.jwtRefreshTokenExpiresTime,
      });

      return refreshToken;
    } catch (error) {
      this.errorService.createError(error);
    }
  }

  generateTokenForgotPassword(id: string) {
    try {
      const token = this.jwtService.signAsync(
        { id },
        {
          secret: this.configSerivce.session.jwtForgotPasswordSecret,
          expiresIn: this.configSerivce.session.jwtForgotPasswordExpiresTime,
        },
      );

      return token;
    } catch (error) {
      this.errorService.createError(error);
    }
  }

  sendEmailForgotPassword(email: string, token: string) {
    const urlreset = this.configSerivce.frontend.urlreset;

    const url = `${urlreset}?token=${token}`;

    return this.mailService.sendEmailForgotPassword(email, url);
  }

  async updateTokenReset(id: string, token: string) {
    const reset = await this.userModel.findByIdAndUpdate(id, {
      tokenreset: token,
    });

    return reset;
  }

  async findUserByTokenReset(token: string) {
    const user = await this.userModel.findOne({ tokenreset: token });
    if (!user) {
      throw new ConflictException('El usuario no existe');
    }

    return user;
  }

  async resetPassword(id: string, password: string) {
    const hashedPassword = await this.hashingService.hash(password);

    const reset = await this.userModel.findByIdAndUpdate(id, {
      password: hashedPassword,
    });

    return reset;
  }

  async existUser(email) {
    const existUser = await this.userModel
      .findOne({ email: email.trim() })
      .exec();

    if (!existUser) {
      return false;
    }

    return true;
  }

  async findUserToAuthenticate(payload: SignInDto) {
    try {
      /** Buscamos los datos del usuario */
      const user = await this.userModel
        .findOne({ email: payload.email.trim() })
        .exec();

      /** Si el usuario no existe enviamos una excepcion */
      if (!user) {
        throw new ConflictException(
          'Por favor ingrese un email y/o contraseña válida',
        );
      }

      /** Confirmamos que la contraseña sea la correcta */
      const isPasswordMatched = await this.hashingService.compare(
        payload.password.trim(),
        user.password,
      );

      if (!isPasswordMatched) {
        throw new ConflictException(
          'Por favor ingrese un email y/o contraseña válida',
        );
      }

      return user;
    } catch (error) {
      this.errorService.createError(error);
    }
  }

  async findUserAutenticated(id: string) {
    try {
      return await this.userModel.findById(id);
    } catch (error) {
      this.errorService.createError(error);
    }
  }

  getFields(type: string) {
    switch (type) {
      case Tipos.Motero:
        return [
          {
            name: 'nombre_portador',
            type: 'text',
            description: 'Nombre del portador de la pulsera',
            required: true,
            private: false,
          },
          {
            name: 'documento',
            type: 'text',
            description: 'Documento del portador de la pulsera',
            required: true,
            private: true,
          },
          {
            name: 'fecha_nacimiento',
            type: 'Date',
            description: 'Fecha de nacimiento del portador de la pulsera',
            required: false,
            private: true,
          },
          {
            name: 'genero',
            type: 'select',
            description: 'Genero del portador de la pulsera',
            opciones: ['Masculino', 'Femenino', 'Otro'],
            required: true,
            private: false,
          },
          {
            name: 'color',
            type: 'select',
            description: 'Color de la pulsera',
            opciones: ['Azul', 'Blanco', 'Rojo', 'Negro'],
            required: true,
            private: false,
          },
          
          {
            name: 'email',
            type: 'email',
            description: 'Email del portador de la pulsera',
            required: false,
            private: true,
          },
          {
            name: 'direccion',
            type: 'text',
            description: 'Dirección del portador de la Pulsera',
            required: true,
            private: true,
          },
          {
            name: 'telefono',
            type: 'telefono',
            description: 'Teléfono del portador de la Pulsera',
            required: true,
            private: false,
          },
          {
            name: 'contacto_de_emergencia',
            type: 'text',
            description: 'Contacto de emergencia',
            required: true,
            private: false,
          },
          {
            name: 'telefono_de_emergencia',
            type: 'telefono',
            description: 'Teléfono de emergencia',
            required: true,
            private: false,
          },
          {
            name: 'rh',
            type: 'select',
            description: 'Rh del portador de la pulsera',
            opciones: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            required: true,
            private: false,
          },
          {
            name: 'alergias',
            type: 'text',
            description: 'Alergias del portador de la pulsera',
            required: true,
            private: false,
          },
          {
            name: 'marca',
            type: 'text',
            description: 'Marca de la moto',
            required: false,
            private: true,
          },
          {
            name: 'cilindraje',
            type: 'number',
            description: 'Cilindraje de la moto',
            required: false,
            private: true,
          },
          {
            name: 'foto_portador',
            type: 'file',
            description: 'Foto del portador de la pulsera',
            required: false,
            private: false,
          },
          {
            name: 'centro_de_salud',
            type: 'text',
            description: 'Centro de salud',
            required: false,
            private: false,
          },
          {
            name: 'compañia_de_seguros',
            type: 'text',
            description: 'Compañía de Seguros',
            required: true,
            private: false,
          },
          {
            name: 'placa',
            type: 'text',
            description: 'Placa de la moto',
            required: true,
            private: false,
          },
          {
            name: 'licencia',
            type: 'file',
            description: 'licencia de conduccion',
            required: false,
            private: true,
          },
          {
            name: 'matricula_o_tarjeta',
            type: 'file',
            description: 'Matricula o tarjeta de circulación',
            required: false,
            private: true,
          },
          {
            name: 'factura',
            type: 'file',
            description: 'factura de la moto',
            required: false,
            private: true,
          },
          {
            name: 'seguro',
            type: 'file',
            description: 'seguro de la moto',
            required: false,
            private: true,
          },
          {
            name: 'tenencias',
            type: 'file',
            description: 'tenencias de la moto',
            required: false,
            private: true,
          },
          {
            name: 'diseño',
            type: 'image',
            description: 'Diseño de la pulsera',
            opciones: ['Tipo Pulsera', 'Tipo Reloj'],
            required: true,
            private: false,
          },
        ];
        break;
      case Tipos.Adulto_Mayor:
        return [
          {
            name: 'nombre_portador',
            type: 'text',
            description: 'Nombre del portador de la pulsera',
            required: true,
            private: false,
          },
          {
            name: 'documento',
            type: 'text',
            description: 'Documento del portador de la pulsera',
            required: false,
            private: true,
          },
          {
            name: 'color',
            type: 'select',
            description: 'Color de la pulsera',
            opciones: ['Azul', 'Blanco', 'Rojo', 'Negro'],
            required: true,
            private: false,
          },
          {
            name: 'fecha_nacimiento',
            type: 'Date',
            description: 'Fecha de nacimiento del portador de la pulsera',
            required: true,
            private: false,
          },
          {
            name: 'genero',
            type: 'select',
            description: 'Genero del portador de la pulsera',
            opciones: ['Masculino', 'Femenino', 'Otro'],
            required: true,
            private: false,
          },
          {
            name: 'email',
            type: 'email',
            description: 'Email del portador de la pulsera',
            required: false,
            private: true,
          },
          {
            name: 'direccion',
            type: 'text',
            description: 'Dirección del portador de la Pulsera',
            required: true,
            private: true,
          },
          {
            name: 'telefono',
            type: 'telefono',
            description: 'Teléfono del portador de la Pulsera',
            required: true,
            private: false,
          },
          {
            name: 'contacto_de_emergencia',
            type: 'text',
            description: 'Contacto de emergencia',
            required: true,
            private: false,
          },
          {
            name: 'telefono_de_emergencia',
            type: 'telefono',
            description: 'Teléfono de emergencia',
            required: true,
            private: false,
          },
          {
            name: 'rh',
            type: 'select',
            description: 'Rh del portador de la pulsera',
            opciones: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            required: true,
            private: false,
          },
          {
            name: 'alergias',
            type: 'text',
            description: 'Alergias del portador de la pulsera',
            required: true,
            private: false,
          },
          {
            name: 'enfermedades',
            type: 'text',
            description: 'Enfermedades del adulto mayor',
            required: true,
            private: false,
          },
          {
            name: 'centro_de_salud',
            type: 'text',
            description: 'Centro de salud',
            required: true,
            private: false,
          },
          {
            name: 'recomendaciones',
            type: 'textarea',
            description: 'Recomendaciones del adulto mayor',
            required: true,
            private: false,
          },
          {
            name: 'foto_portador',
            type: 'file',
            description: 'Foto del portador de la pulsera',
            required: true,
            private: false,
          },
          {
            name: 'diseño',
            type: 'image',
            description: 'Diseño de la pulsera',
            opciones: ['Tipo Pulsera', 'Tipo Reloj'],
            required: true,
            private: false,
          },
        ];
        break;
      case Tipos.Niño:
        return [
          {
            name: 'nombre_portador',
            type: 'text',
            description: 'Nombre del portador de la pulsera',
            required: true,
            private: false,
          },
          {
            name: 'documento',
            type: 'text',
            description: 'Documento del portador de la pulsera',
            required: false,
            private: true,
          },
          {
            name: 'color',
            type: 'select',
            description: 'Color de la pulsera',
            opciones: ['Azul', 'Blanco', 'Rojo', 'Negro'],
            required: true,
            private: false,
          },
          {
            name: 'fecha_nacimiento',
            type: 'Date',
            description: 'Fecha de nacimiento del portador de la pulsera',
            required: false,
            private: true,
          },
          {
            name: 'genero',
            type: 'select',
            description: 'Genero del portador de la pulsera',
            opciones: ['Masculino', 'Femenino', 'Otro'],
            required: true,
            private: false,
          },
          {
            name: 'email',
            type: 'email',
            description: 'Email del portador de la pulsera',
            required: false,
            private: true,
          },
          {
            name: 'direccion',
            type: 'text',
            description: 'Dirección del portador de la Pulsera',
            required: true,
            private: true,
          },
          {
            name: 'telefono',
            type: 'telefono',
            description: 'Teléfono del portador de la Pulsera',
            required: true,
            private: false,
          },
          {
            name: 'contacto_de_emergencia',
            type: 'text',
            description: 'Contacto de emergencia',
            required: true,
            private: false,
          },
          {
            name: 'telefono_de_emergencia',
            type: 'telefono',
            description: 'Teléfono de emergencia',
            required: true,
            private: false,
          },
          {
            name: 'rh',
            type: 'select',
            description: 'Rh del portador de la pulsera',
            opciones: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            required: true,
            private: false,
          },
          {
            name: 'alergias',
            type: 'text',
            description: 'Alergias del portador de la pulsera',
            required: true,
            private: false,
          },
          {
            name: 'enfermedades',
            type: 'text',
            description: 'Enfermedades del niño',
            required: true,
            private: false,
          },
          {
            name: 'centro_de_salud',
            type: 'text',
            description: 'Centro de salud',
            required: false,
            private: false,
          },
          {
            name: 'recomendaciones',
            type: 'textarea',
            description: 'Recomendaciones del niño',
            required: false,
            private: false,
          },
          {
            name: 'nombre_padre',
            type: 'text',
            description: 'Nombre del padre',
            required: false,
            private: true,
          },
          {
            name: 'nombre_madre',
            type: 'text',
            description: 'Nombre de la madre',
            required: false,
            private: true,
          },
          {
            name: 'telefono_padre',
            type: 'telefono',
            description: 'Telefono del padre',
            required: false,
            private: true,
          },
          {
            name: 'telefono_madre',
            type: 'telefono',
            description: 'Telefono de la madre',
            required: false,
            private: true,
          },
          {
            name: 'foto_portador',
            type: 'file',
            description: 'Foto del portador de la pulsera',
            required: true,
            private: false,
          },
          {
            name: 'diseño',
            type: 'image',
            description: 'Diseño de la pulsera',
            opciones: ['Tipo Pulsera', 'Tipo Reloj'],
            required: true,
            private: false,
          },
        ];
        break;
      case Tipos.Mascota:
        return [
          {
            name: 'nombre_duenio',
            type: 'text',
            description: 'Nombre del dueño de la mascota',
            required: true,
            private: false,
          },
          {
            name: 'nombre_mascota',
            type: 'text',
            description: 'Nombre de la mascota',
            required: true,
          },
          {
            name: 'color',
            type: 'select',
            description: 'Color de la placa',
            opciones: ['Azul', 'Blanco', 'Rojo', 'Negro'],
            required: true,
            private: false,
          },
          {
            name: 'email',
            type: 'email',
            description: 'Email del dueño',
            required: false,
            private: true,
          },
          {
            name: 'direccion',
            type: 'text',
            description: 'Direccion de la Mascota',
            required: true,
            private: true,
          },
          {
            name: 'telefono',
            type: 'telefono',
            description: 'Telefono del dueño',
            required: true,
            private: false,
          },
          {
            name: 'contacto_de_emergencia',
            type: 'text',
            description: 'Contacto de emergencia',
            required: true,
            private: false,
          },
          {
            name: 'telefono_de_emergencia',
            type: 'telefono',
            description: 'Teléfono de emergencia',
            required: true,
            private: false,
          },
          {
            name: 'enfermedades',
            type: 'text',
            description: 'Enfermedades de la mascota',
            required: false,
            private: false,
          },
          {
            name: 'centro_de_salud',
            type: 'text',
            description: 'Centro de salud',
            required: false,
            private: false,
          },
          {
            name: 'fecha_nacimiento_mascota',
            type: 'Date',
            description: 'Fecha de nacimiento de la mascota',
            required: false,
            private: true,
          },
          {
            name: 'raza',
            type: 'text',
            description: 'Raza de la mascota',
            required: true,
            private: false,
          },

          {
            name: 'foto_portador',
            type: 'file',
            description: 'Foto del portador de la placa',
            required: true,
            private: false,
          },
          {
            name: 'diseño',
            type: 'image',
            description: 'Tipo de Collar',
            opciones: ['Collar'],
            required: true,
            private: false,
          },
        ];
        break;
      case Tipos.Deportista:
        return [
          {
            name: 'nombre_portador',
            type: 'text',
            description: 'Nombre del portador de la pulsera',
            required: true,
            private: false,
          },
          {
            name: 'documento',
            type: 'text',
            description: 'Documento del portador de la pulsera',
            required: true,
            private: true,
          },
          {
            name: 'fecha_nacimiento',
            type: 'Date',
            description: 'Fecha de nacimiento del portador de la pulsera',
            required: false,
            private: true,
          },
          {
            name: 'genero',
            type: 'select',
            description: 'Genero del portador de la pulsera',
            opciones: ['Masculino', 'Femenino', 'Otro'],
            required: true,
            private: false,
          },
          {
            name: 'color',
            type: 'select',
            description: 'Color de la pulsera',
            opciones: ['Azul', 'Blanco', 'Rojo', 'Negro'],
            required: true,
            private: false,
          },
          {
            name: 'email',
            type: 'email',
            description: 'Email del portador de la pulsera',
            required: false,
            private: true,
          },
          {
            name: 'direccion',
            type: 'text',
            description: 'Dirección del portador de la Pulsera',
            required: true,
            private: true,
          },
          {
            name: 'telefono',
            type: 'telefono',
            description: 'Teléfono del portador de la Pulsera',
            required: true,
            private: false,
          },
          {
            name: 'contacto_de_emergencia',
            type: 'text',
            description: 'Contacto de emergencia',
            required: true,
            private: false,
          },
          {
            name: 'telefono_de_emergencia',
            type: 'telefono',
            description: 'Teléfono de emergencia',
            required: true,
            private: false,
          },
          {
            name: 'rh',
            type: 'select',
            description: 'Rh del portador de la pulsera',
            opciones: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            required: true,
            private: false,
          },
          {
            name: 'alergias',
            type: 'text',
            description: 'Alergias del portador de la pulsera',
            required: true,
            private: false,
          },
          {
            name: 'foto_portador',
            type: 'file',
            description: 'Foto del portador de la pulsera',
            required: false,
            private: false,
          },
          {
            name: 'centro_de_salud',
            type: 'text',
            description: 'Centro de salud',
            required: false,
            private: false,
          },
          {
            name: 'compañia_de_seguros',
            type: 'text',
            description: 'Compañia de seguros',
            required: true,
            private: false,
          },
          {
            name: 'deporte',
            type: 'text',
            description: 'Tipo de deporte que practica',
            required: true,
            private: false,
          },
          {
            name: 'historia_clinica',
            type: 'file',
            description: 'Historia clinica',
            required: false,
            private: true,
          },
          {
            name: 'archivos',
            type: 'file',
            description: 'archivos',
            required: false,
            private: true,
          },
          {
            name: 'diseño',
            type: 'image',
            description: 'Diseño de la pulsera',
            opciones: ['Tipo Pulsera', 'Tipo Reloj'],
            required: true,
            private: false,
          },
        ];
        break;
    }
  }
  getTypes() {
    return [
      {
        name: Tipos.Motero,
        description: 'Motociclista',
      },
      {
        name: Tipos.Adulto_Mayor,
        description: 'Adulto Mayor',
      },
      {
        name: Tipos.Niño,
        description: 'Niño',
      },
      {
        name: Tipos.Mascota,
        description: 'Mascota',
      },
      {
        name: Tipos.Deportista,
        description: 'Deportista',
      },
    ];
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email: email.trim() }).exec();
      if (!user) {
        throw new ConflictException('El usuario no existe');
      }
      return user;
    } catch (error) {
      this.errorService.createError(error);
    }
  }
}
