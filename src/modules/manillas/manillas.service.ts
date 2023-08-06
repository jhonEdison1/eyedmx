import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateEntradaDto, CreateManillaDto, ManillaAdulto_MayorDto, ManillaMascotaDto, ManillaMoteroDto, ManillaNiñoDto } from './dto/create-manilla.dto';
import { UpdateManillaDto } from './dto/update-manilla.dto';
import { validate } from 'class-validator';
import { Manilla, estadoManilla } from './entities/manilla.entity';
import { FilterQuery, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Tipos } from '../iam/authentication/authentication.common.service';
import { FilterManillaDto } from './dto/filter-manilla.dto';
import config from 'src/config';
import { ConfigType } from '@nestjs/config';
import * as qr from 'qrcode';
import * as fs from 'fs';
import * as AWS from 'aws-sdk';
import { format, parseISO } from 'date-fns';

@Injectable()
export class ManillasService {

  private readonly s3: AWS.S3;

  constructor(
    @Inject(config.KEY) private readonly configSerivce: ConfigType<typeof config>,
    @InjectModel(Manilla.name) private readonly manillaModel: Model<Manilla>


  ) {
    this.s3 = new AWS.S3({
      // Configura las credenciales y región de AWS adecuadamente
      accessKeyId: this.configSerivce.s3.accessKeyId,
      secretAccessKey: this.configSerivce.s3.secretAccessKey,
      region: this.configSerivce.s3.region
    });

  }


  async createManilla(createManillaDto: CreateManillaDto, userId: string) {

    // Validar el objeto recibido utilizando las decoraciones de class-validator
    const errors = await validate(createManillaDto);
    if (errors.length > 0) {
      throw new ConflictException('Datos inválidos');
    }

    if (createManillaDto.userId !== userId) {
      throw new UnauthorizedException('No tiene permisos para crear manillas para otro usuario');
    }

    // Identificar el tipo de manilla en función de la propiedad 'tipo'
    let manilla;

    switch (createManillaDto.tipo) {
      case Tipos.Motero:
        manilla = new ManillaMoteroDto();
        break;
      case Tipos.Adulto_Mayor:
        manilla = new ManillaAdulto_MayorDto();
        break;
      case Tipos.Niño:
        manilla = new ManillaNiñoDto();
        break;
      case Tipos.Mascota:
        manilla = new ManillaMascotaDto();
        break;
      default:
        throw new ConflictException('Tipo de manilla no válido');
    }

    // Asignar los valores del objeto recibido a la instancia de la manilla
    Object.assign(manilla, createManillaDto);
    // console.log(manilla)



    // Validar la instancia específica de la manilla
    const customErrors = await validate(manilla);

    if (customErrors.length > 0) {
      throw new ConflictException('Datos inválidos para el tipo de manilla' + customErrors);
    }

    // Crear la manilla en la base de datos
    const newRecord = new this.manillaModel(manilla);
    const newManilla = await newRecord.save();
    return newManilla;
  }



  async findSolicitudes(params?: FilterManillaDto) {
    //obtener todas las manillas que tenga el estado Solicitada paginadas con el limit y offset de params

    const [manillas, totalDocuments] = await Promise.all([
      this.manillaModel
        .find({ estado: estadoManilla.Solicitada })
        .skip(params.offset)
        .limit(params.limit)
        .populate({ path: 'userId', select: 'name' })
        .exec(),
      this.manillaModel.countDocuments({ estado: estadoManilla.Solicitada }).exec(),
    ]);

    return {
      manillas,
      totalDocuments,
    };






  }


  async findAceptadasHoy(params?: FilterManillaDto) {

    const horaInicio = new Date(new Date().setHours(0o0, 0o0, 0o0));
    const horaFin = new Date(new Date().setHours(23, 59, 59));


    const [manillas, totalDocuments] = await Promise.all([
      this.manillaModel
        .find({ estado: estadoManilla.Aceptada, createdAt: { $gte: horaInicio, $lte: horaFin } })
        .skip(params.offset)
        .limit(params.limit)
        .populate({ path: 'userId', select: 'name' })
        .exec(),
      this.manillaModel.countDocuments({ estado: estadoManilla.Aceptada, createdAt: { $gte: horaInicio, $lte: horaFin } }).exec(),
    ]);


    //las resagadas son las que fueron aceptadas antes de hoy y no han sido entregadas, a excepcion de las que fueron aceptadas hoy

    const [manillasResagadas, totalDocumentsResagadas] = await Promise.all([
      this.manillaModel
        .find({ estado: estadoManilla.Aceptada, createdAt: { $lt: horaInicio } })
        .skip(params.offset)
        .limit(params.limit)
        .populate({ path: 'userId', select: 'name' })
        .exec(),
      this.manillaModel.countDocuments({ estado: estadoManilla.Aceptada, createdAt: { $lt: horaInicio } }).exec(),
    ]);



    return {
      manillas,
      totalDocuments,
      manillasResagadas,
      totalDocumentsResagadas
    };




  }

  async findById(id: string) {
    try {
      const manilla = (await this.manillaModel.findById(id)).populate({ path: 'userId', select: 'name' })
      if (!manilla) {
        throw new NotFoundException('Manilla no encontrada');
      }
      return manilla;

    } catch (error) {
      throw new NotFoundException('Manilla no encontrada' + error);

    }

  }


  async findAll(params?: FilterManillaDto) {

    const filters: FilterQuery<Manilla> = {};
    const { limit, offset, estado, tipo } = params;

    /** Si existen parámetros entonces aplicamos filtros de búsqueda */
    if (params) {
      if (estado) {
        filters.estado = {
          $regex: estado,
          $options: "i",
        };
      }
      if (tipo) {
        filters.tipo = {
          $regex: tipo,
          $options: "i",
        };
      }
    }

    const [manillas, totalDocuments] = await Promise.all([
      this.manillaModel
        .find(filters)
        .skip(offset)
        .limit(limit)
        .populate({ path: 'userId', select: 'name' })
        .exec(),
      this.manillaModel.countDocuments(filters).exec(),
    ]);

    return {
      manillas,
      totalDocuments
    };



  }


  getEstados() {
    const estados = Object.keys(estadoManilla).map((key) => ({
      name: key,
      value: estadoManilla[key],
    }));
    return estados;
  }

  async aceptarManilla(id: string) {
    try {
      const exist = await this.manillaModel.findById(id).exec();

      if (!exist) {
        throw new NotFoundException('No existe la manilla');
      }

      const estado = exist.estado;
      if ([estadoManilla.Aceptada, estadoManilla.Entregada, estadoManilla.Rechazada, estadoManilla.Enviada].includes(estado)) {
        throw new ConflictException(`La manilla ya fue ${estado}`);
      }

      const urlFront = this.configSerivce.frontend.url;
      const urlInfo = this.configSerivce.frontend.urlinfo;
      const url = `${urlFront}/${urlInfo}/${id}`;

      const qrData = url;
      const qrOptions = { type: 'svg', errorCorrectionLevel: 'high', scale: 8 };
      const qrCodeSvg = await qr.toString(qrData, qrOptions);

      // Guardar el archivo SVG en disco (opcional)
      //fs.writeFileSync(`manilla_${id}.svg`, qrCodeSvg);

      // Aquí, subir el SVG a S3 (implementar esta funcionalidad)
      const uploadFolderPath = 'uploads';
      const currentDate = new Date();
      const formattedDate = format(currentDate, 'yyyy-MM-dd');
      const dailyFolderPath = `${uploadFolderPath}/${formattedDate}`;
      const fileName = `manilla_${id}.svg`;

      // Subir el archivo SVG al S3
      const s3Params: AWS.S3.PutObjectRequest = {
        Bucket: this.configSerivce.s3.bucket,
        Key: `${dailyFolderPath}/${fileName}`,
        Body: qrCodeSvg,
        ContentType: 'image/svg+xml', // Establecer el tipo de contenido correcto
      };

      const uploadedObject = await this.s3.putObject(s3Params).promise();
      // const uploadedObject = await this.s3.upload(s3Params).promise();

      // Obtener la URL del objeto recién subido
      // const urlqr = this.s3.getSignedUrl('getObject', {
      //   Bucket: this.configSerivce.s3.bucket,
      //   Key: `${dailyFolderPath}/${fileName}`       
      // });

      //const urlqr = uploadedObject.Location

      const urlqr = this.s3.getSignedUrl('getObject', {
        Bucket: this.configSerivce.s3.bucket,
        Key: `${dailyFolderPath}/${fileName}`

      });




      exist.estado = estadoManilla.Aceptada;
      exist.qrCode = urlqr;
      const manilla = await exist.save();

      return {
        message: 'Manilla aceptada satisfactoriamente',
        manilla,
        //qrCodeSvg,
      };
    } catch (error) {
      throw new ConflictException('No se pudo aceptar la manilla: ' + error.message);
    }
  }



  async obtenerMisManillasAgrupadasPorTipo(userId: string) {

    try {
      const misManillas =
        await this.manillaModel.aggregate([
          { $match: { userId: userId } },
          { $group: { _id: '$tipo', manillas: { $push: '$$ROOT' }, } },
        ]);

      return misManillas;



    } catch (error) {
      throw new ConflictException('Error al obtener las manillas agrupadas por tipo' + error.message);
    }
  }



  async obtenerInfoMotoPorPlaca(placa: string) {

    const manilla = await this.manillaModel.findOne({ placa: placa }).populate({ path: 'userId', select: 'name' })

    if (!manilla) {
      throw new NotFoundException('No existe ninguna manilla asociada a la placa proporcionada');
    }

    const infoRetorno = {

      placa: manilla.placa,
      marca: manilla.marca,
      cilindraje: manilla.cilindraje,
      conductor: manilla.userId.name,
      entradas: manilla.entradas,

    }
    return infoRetorno;
  }


  async crearEntradaManilla(placa: string, createEntradaManillaDto: CreateEntradaDto, userId: string) {

    const manilla = await (await this.manillaModel.findOne({ placa: placa }).populate({ path: 'userId', select: 'name' }))

    if (!manilla) {
      throw new NotFoundException('No existe ninguna manilla asociada a la placa proporcionada');
    }

    const entrada = {
      taller: userId,
      observaciones: createEntradaManillaDto.observaciones,
      fecha: new Date()
    }

    manilla.entradas.push(entrada);

    await manilla.save();

    const infoRetorno = {

      placa: manilla.placa,
      marca: manilla.marca,
      cilindraje: manilla.cilindraje,
      conductor: manilla.userId.name,
      entradas: manilla.entradas,



    }


    return infoRetorno;





  }













  findOne(id: number) {
    return `This action returns a #${id} manilla`;
  }

  update(id: number, updateManillaDto: UpdateManillaDto) {
    return `This action updates a #${id} manilla`;
  }

  remove(id: number) {
    return `This action removes a #${id} manilla`;
  }








}
