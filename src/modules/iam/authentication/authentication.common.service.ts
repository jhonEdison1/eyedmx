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

export enum Tipos {
  Motero = 'Motero',
  Adulto_Mayor = 'Adulto_Mayor',
  Niño = 'Niño',
  Mascota = 'Mascota'
}



@Injectable()
export class AuthenticationCommonService {

  constructor(
    @Inject(config.KEY) private readonly configSerivce: ConfigType<typeof config>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly errorService: ErrorsService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) { }




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





  async findUserToAuthenticate(payload: SignInDto) {
    try {
      /** Buscamos los datos del usuario */
      const user = await this.userModel.findOne({ email: payload.email.trim() }).exec();

      /** Si el usuario no existe enviamos una excepcion */
      if (!user) {
        throw new ConflictException("Por favor ingrese un email y/o contraseña válida");
      }

      /** Confirmamos que la contraseña sea la correcta */
      const isPasswordMatched = await this.hashingService.compare(payload.password.trim(), user.password);

      if (!isPasswordMatched) {
        throw new ConflictException("Por favor ingrese un email y/o contraseña válida");
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
            name: "marca",
            type: "text",
            description: "Marca de la moto",
            required: true
          },
          {
            name: "cilindraje",
            type: "number",
            description: "Cilindraje de la moto",
            required: true
          },
          {
            name: "compañia_de_seguros",
            type: "text",
            description: "Compañia de seguros",
            required: true
          },
          {
            name: "genero",
            type: "select",
            description: "Genero del portador de la manilla",
            opciones: ["Masculino", "Femenino", "Otro"],
            required: true
          },
          {
            name: "placa",
            type: "text",
            description: "Placa de la moto",
            required: true

          },
          {
            name: "rh",
            type: "text",
            description: "rh del portador de la manilla",
            required: true

          },
          {
            name: "alergias",
            type: "text",
            description: "Alergias del portador de la manilla",
            required: false
          }
        ];
        break;
      case Tipos.Adulto_Mayor:
        return [
          {
            name: "genero",
            type: "select",
            description: "Genero del portador de la manilla",
            opciones: ["Masculino", "Femenino", "Otro"],
            required: true
          },
          {
            name: "enfermedades",
            type: "text",
            description: "Enfermedades del adulto mayor",
            required: true
          },
          {
            name: "recomendaiones",
            type: "textarea",
            description: "Recomendaciones del adulto mayor",
            required: false
          },
          {
            name: "rh",
            type: "text",
            description: "rh del portador de la manilla",
            required: true

          },
          {
            name: "alergias",
            type: "text",
            description: "Alergias del portador de la manilla",
            required: false
          }
        ];
        break;
      case Tipos.Niño:
        return [
          {
            name: "genero",
            type: "select",
            description: "Genero del portador de la manilla",
            opciones: ["Masculino", "Femenino", "Otro"],
            required: true
          },
          {
            name: "enfermedades",
            type: "text",
            description: "Enfermedades del niño",
            required: false
          },
          {
            name: "recomendaiones",
            type: "textarea",
            description: "Recomendaciones del niño",
            required: false
          },
          {
            name: "nombre_padre",
            type: "text",
            description: "Nombre del padre",
            required: false
          },
          {
            name: "nombre_madre",
            type: "text",
            description: "Nombre de la madre",
            required: false
          },
          {
            name: "telefono_padre",
            type: "text",
            description: "Telefono del padre",
            required: false
          },
          {
            name: "telefono_madre",
            type: "text",
            description: "Telefono de la madre",
            required: false
          } ,
          {
            name: "rh",
            type: "text",
            description: "rh del portador de la manilla",
            required: true

          },
          {
            name: "alergias",
            type: "text",
            description: "Alergias del portador de la manilla",
            required: false
          }         
        ];
        break;
        case Tipos.Mascota:
          return [
            {
              name: "enfermedades",
              type: "text",
              description: "Enfermedades de la mascota",
              required: false
            },
            {
              name: "fecha_nacimiento_mascota",
              type: "Date",
              description: "Fecha de nacimiento de la mascota",
              required: false
            },
            {
              name: "raza",
              type: "text",
              description: "Raza de la mascota",
              required: false
            },
            {
              name: "nombre_masctoa",
              type: "text",
              description: "Nombre de la mascota",
              required: true
            }
          ];
    }
  }

  getTypes() {
    return [
      {
        name: Tipos.Motero,
        description: "Motero"
      },
      {
        name: Tipos.Adulto_Mayor,
        description: "Adulto Mayor"
      },
      {
        name: Tipos.Niño,
        description: "Niño"
      },
      {
        name: Tipos.Mascota,
        description: "Mascota"
      }
    ];

  }

}
