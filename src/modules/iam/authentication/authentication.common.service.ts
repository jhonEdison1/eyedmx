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
      case "Motero":
        return [
          {
            name: "marca",
            type: "text",
            description: "Marca de la moto",
          },
          {
            name: "cilindraje",
            type: "text",
            description: "Cilindraje de la moto",
          },
          {
            name: "compañia_de_seguros",
            type: "text",
            description: "Compañia de seguros",
          },
          {
            name: "genero",
            type: "text",
            description: "Genero del motero"
          }, 
          {
            name: "placa",
            type: "text",
            description: "Placa de la moto"

          }
        ];
        break;
      case "Adulto_Mayor":
        return [
          {
            name: "genero",
            type: "text",
            description: "Genero del adulto mayor"
          },
          {
            name: "enfermedades",
            type: "text",
            description: "Enfermedades del adulto mayor"
          },
          {
            name: "recomendaiones",
            type: "text",
            description: "Recomendaciones del adulto mayor"
          },
        ];
        break;
      case "Niño":
        return [
          {
            name: "genero",
            type: "text",
            description: "Genero del niño"
          },
          {
            name: "enfermedades",
            type: "text",
            description: "Enfermedades del niño"
          },
          {
            name: "recomendaiones",
            type: "text",
            description: "Recomendaciones del niño"
          },
          {
            name: "nombre_padre",
            type: "text",
            description: "Nombre del padre"
          },
          {
            name: "nombre_madre",
            type: "text",
            description: "Nombre de la madre"
          },
          {
            name: "telefono_padre",
            type: "text",
            description: "Telefono del padre"
          },
          {
            name: "telefono_madre",
            type: "text",
            description: "Telefono de la madre"
          }          
        ];
        break;
        case "Mascota":
          return [
            {
              name: "enfermedades",
              type: "text",
              description: "Enfermedades de la mascota"
            },
            {
              name: "fecha_nacimiento",
              type: "text",
              description: "Fecha de nacimiento de la mascota"
            },
            {
              name: "raza",
              type: "text",
              description: "Raza de la mascota"
            }
          ];
    }
  }

  getTypes() {
    return [
      {
        name: "Motero",
        description: "Motero"
      },
      {
        name: "Adulto_Mayor",
        description: "Adulto Mayor"
      },
      {
        name: "Niño",
        description: "Niño"
      },
      {
        name: "Mascota",
        description: "Mascota"
      }
    ];

  }

}
