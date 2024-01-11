import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateManillaDto, ManillaAdulto_MayorDto, ManillaDeportistaDto, ManillaMascotaDto, ManillaMoteroDto, ManillaNiñoDto } from './dto/create-manilla.dto';
import { EditManillaDto, UpdateManillaDto } from './dto/update-manilla.dto';
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
import { EntradasService } from '../entradas/entradas.service';
import { CreateEntradaDto } from '../entradas/dto/create-entrada.dto';
import { MailService } from '../mail/mail.service';
import * as sharp from 'sharp';
import { ConvertioService } from '../convertio/convertio.service';














@Injectable()
export class ManillasService {

  private readonly s3: AWS.S3;


  constructor(
    @Inject(config.KEY) private readonly configSerivce: ConfigType<typeof config>,
    @InjectModel(Manilla.name) private readonly manillaModel: Model<Manilla>,
    private readonly entradaService: EntradasService,
    private readonly mailService: MailService,
    private readonly convertioService: ConvertioService


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
      throw new UnauthorizedException('No tiene permisos para crear pulseras para otro usuario');
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
      case Tipos.Deportista:
        manilla = new ManillaDeportistaDto();
        break;
      default:
        throw new ConflictException('Tipo de pulsera no válido');
    }

    // Asignar los valores del objeto recibido a la instancia de la manilla
    Object.assign(manilla, createManillaDto);
    // console.log(manilla)



    // Validar la instancia específica de la manilla
    const customErrors = await validate(manilla);

    if (customErrors.length > 0) {
      throw new ConflictException('Datos inválidos para el tipo de pulsera' + customErrors);
    }

    const lastNumId = await this.findLastNumId();



    // Crear la manilla en la base de datos
    const newRecord = new this.manillaModel(manilla);

    newRecord.numid = lastNumId + 1;

    // if (createManillaDto.foto_portador) {
    //   let dataD = createManillaDto.foto_portador;
    //   let extension = dataD.substring("data:".length, dataD.indexOf(";base64"))

    //   if (extension == 'application/pdf') {

    //     dataD = dataD.replace('data:application/pdf;base64,', '')
    //     extension = 'pdf'

    //   } else if (extension == 'image/png') {

    //     dataD = dataD.replace('data:image/png;base64,', '');
    //     extension = 'png'

    //   } else if (extension == 'image/jpeg') {

    //     dataD = dataD.replace('data:image/jpeg;base64,', '');
    //     extension = 'jpg'
    //   } else if (extension == 'image/jpg') {

    //     dataD = dataD.replace('data:image/jpg;base64,', '');
    //     extension = 'jpg'
    //   }

    //   newRecord.foto_portador = await this.uploadBase64ToS3(newRecord._id.toString(), dataD /*createManillaDto.foto_portador*/, 'foto_portador', extension);
    // }


    // if (createManillaDto.licencia) {
    //   let dataD = createManillaDto.licencia;
    //   let extension = dataD.substring("data:".length, dataD.indexOf(";base64"))

    //   if (extension == 'application/pdf') {

    //     dataD = dataD.replace('data:application/pdf;base64,', '')
    //     extension = 'pdf'

    //   } else if (extension == 'image/png') {

    //     dataD = dataD.replace('data:image/png;base64,', '');
    //     extension = 'png'

    //   } else if (extension == 'image/jpeg') {

    //     dataD = dataD.replace('data:image/jpeg;base64,', '');
    //     extension = 'jpg'
    //   } else if (extension == 'image/jpg') {

    //     dataD = dataD.replace('data:image/jpg;base64,', '');
    //     extension = 'jpg'
    //   }
    //   newRecord.licencia = await this.uploadBase64ToS3(newRecord._id.toString(), dataD, 'licencia', extension);
    // }

    // if (createManillaDto.matricula_o_tarjeta) {
    //   let dataD = createManillaDto.matricula_o_tarjeta;
    //   let extension = dataD.substring("data:".length, dataD.indexOf(";base64"))

    //   if (extension == 'application/pdf') {

    //     dataD = dataD.replace('data:application/pdf;base64,', '')
    //     extension = 'pdf'

    //   } else if (extension == 'image/png') {

    //     dataD = dataD.replace('data:image/png;base64,', '');
    //     extension = 'png'

    //   } else if (extension == 'image/jpeg') {

    //     dataD = dataD.replace('data:image/jpeg;base64,', '');
    //     extension = 'jpg'
    //   } else if (extension == 'image/jpg') {

    //     dataD = dataD.replace('data:image/jpg;base64,', '');
    //     extension = 'jpg'
    //   }
    //   newRecord.matricula_o_tarjeta = await this.uploadBase64ToS3(newRecord._id.toString(), dataD, 'matricula_o_tarjeta', extension);
    // }

    // if (createManillaDto.factura) {
    //   let dataD = createManillaDto.factura;
    //   let extension = dataD.substring("data:".length, dataD.indexOf(";base64"))

    //   if (extension == 'application/pdf') {

    //     dataD = dataD.replace('data:application/pdf;base64,', '')
    //     extension = 'pdf'

    //   } else if (extension == 'image/png') {

    //     dataD = dataD.replace('data:image/png;base64,', '');
    //     extension = 'png'

    //   } else if (extension == 'image/jpeg') {

    //     dataD = dataD.replace('data:image/jpeg;base64,', '');
    //     extension = 'jpg'
    //   } else if (extension == 'image/jpg') {

    //     dataD = dataD.replace('data:image/jpg;base64,', '');
    //     extension = 'jpg'
    //   }
    //   newRecord.factura = await this.uploadBase64ToS3(newRecord._id.toString(), dataD, 'factura', extension);
    // }

    // if (createManillaDto.seguro) {
    //   let dataD = createManillaDto.seguro;
    //   let extension = dataD.substring("data:".length, dataD.indexOf(";base64"))

    //   if (extension == 'application/pdf') {

    //     dataD = dataD.replace('data:application/pdf;base64,', '')
    //     extension = 'pdf'

    //   } else if (extension == 'image/png') {

    //     dataD = dataD.replace('data:image/png;base64,', '');
    //     extension = 'png'

    //   } else if (extension == 'image/jpeg') {

    //     dataD = dataD.replace('data:image/jpeg;base64,', '');
    //     extension = 'jpg'
    //   } else if (extension == 'image/jpg') {

    //     dataD = dataD.replace('data:image/jpg;base64,', '');
    //     extension = 'jpg'
    //   }
    //   newRecord.seguro = await this.uploadBase64ToS3(newRecord._id.toString(), dataD, 'seguro', extension);
    // }

    // if (createManillaDto.tenencias) {
    //   let dataD = createManillaDto.tenencias;
    //   let extension = dataD.substring("data:".length, dataD.indexOf(";base64"))

    //   if (extension == 'application/pdf') {

    //     dataD = dataD.replace('data:application/pdf;base64,', '')
    //     extension = 'pdf'

    //   } else if (extension == 'image/png') {

    //     dataD = dataD.replace('data:image/png;base64,', '');
    //     extension = 'png'

    //   } else if (extension == 'image/jpeg') {

    //     dataD = dataD.replace('data:image/jpeg;base64,', '');
    //     extension = 'jpg'
    //   } else if (extension == 'image/jpg') {

    //     dataD = dataD.replace('data:image/jpg;base64,', '');
    //     extension = 'jpg'
    //   }
    //   newRecord.tenencias = await this.uploadBase64ToS3(newRecord._id.toString(), dataD, 'tenencias', extension);
    // }


    await this.processAndUploadField(newRecord, 'foto_portador', createManillaDto.foto_portador);
    await this.processAndUploadField(newRecord, 'licencia', createManillaDto.licencia);
    await this.processAndUploadField(newRecord, 'matricula_o_tarjeta', createManillaDto.matricula_o_tarjeta);
    await this.processAndUploadField(newRecord, 'factura', createManillaDto.factura);
    await this.processAndUploadField(newRecord, 'seguro', createManillaDto.seguro);
    await this.processAndUploadField(newRecord, 'tenencias', createManillaDto.tenencias);
    await this.processAndUploadField(newRecord, 'historia_clinica', createManillaDto.historia_clinica);





    const newManilla = await newRecord.save();
    return newManilla;
  }



  async solicitarVarias(createManillaDto: CreateManillaDto[], userId: string) {
    const manillas = [];
    for (let i = 0; i < createManillaDto.length; i++) {
      if (createManillaDto[i].userId !== userId) {
        throw new UnauthorizedException('No tiene permisos para crear pulseras para otro usuario');
      }
      let manilla = await this.createManilla(createManillaDto[i], userId);
      manillas.push(manilla);
    }
    return manillas;
  }




  async getTipoPorIdManilla(id: string) {

    const manilla = await this.manillaModel.findById(id).exec()

    if (!manilla) {
      throw new ConflictException('No existe la manilla')
    }

    return manilla.tipo


  }


  async uploadBase64ToS3(id: string, base64Data: string, field: string, extension: string): Promise<string> {
    const buffer = Buffer.from(base64Data, 'base64');
    const contentType = extension === 'pdf' ? 'application/pdf' : `image/${extension}`;
    const fileName = `portador/${id}/${field}`;

    const s3Params: AWS.S3.PutObjectRequest = {
      Bucket: this.configSerivce.s3.bucket,
      Key: `${fileName}.${extension}`,
      Body: buffer,
      ContentType: contentType,
    };

    try {
      const uploadedObject = await this.s3.upload(s3Params).promise();
      const urlarchivo = uploadedObject.Location;
      return urlarchivo;
    } catch (error) {
      throw new Error(`Error al subir la imagen a S3: ${error.message}`);
    }
  }



  async processAndUploadField(
    newRecord: Manilla,
    field: string,
    base64Data: string | undefined
  ): Promise<void> {
    if (base64Data) {
      const { data, extension } = this.extractBase64DataAndExtension(base64Data);
      newRecord[field] = await this.uploadBase64ToS3(newRecord._id.toString(), data, field, extension);
    }
  }


  async processAndUploadUpdateField(
    newRecord: Manilla,
    field: string,
    base64Data: string | undefined
  ) {
    if (base64Data) {
      const { data, extension } = this.extractBase64DataAndExtension(base64Data);
      const resultado =  await this.uploadBase64ToS3(newRecord._id.toString(), data, field, extension);
      return resultado
    }
  }








  extractBase64DataAndExtension(base64Data: string): { data: string; extension: string } {
    const matches = base64Data.match(/^data:(image|application)\/(pdf|png|jpe?g);base64,(.+)$/i);

    if (!matches || matches.length !== 4) {
      throw new ConflictException('Formato de datos inválido');
    }

    const [, type, extension, data] = matches;
    return { data, extension };
  }





















  async editManilla(id: string, editManillaDto: EditManillaDto, userId: string) {

    //validar que exista la manilla y que el usuario que la solicita sea el mismo que la creo

    const manilla = await this.manillaModel.findById(id)

    if (!manilla) {
      throw new NotFoundException('No existe la pulsera');
    }
    if (manilla.userId.toString() !== userId) {
      throw new UnauthorizedException('No tiene permisos para editar esta pulsera');
    }

    // Validar el objeto recibido utilizando las decoraciones de class-validator
    const errors = await validate(editManillaDto);

    if (errors.length > 0) {
      throw new ConflictException('Datos inválidos');
    }


    if (editManillaDto.foto_portador) {
      manilla.foto_portador = await this.processAndUploadUpdateField(manilla, 'foto_portador', editManillaDto.foto_portador);
      editManillaDto.foto_portador = manilla.foto_portador;  
    }
    if (editManillaDto.licencia) {
      manilla.licencia = await this.processAndUploadUpdateField(manilla, 'licencia', editManillaDto.licencia);
      editManillaDto.licencia = manilla.licencia;     
    }
    if (editManillaDto.matricula_o_tarjeta) {
      manilla.matricula_o_tarjeta = await this.processAndUploadUpdateField(manilla, 'matricula_o_tarjeta', editManillaDto.matricula_o_tarjeta);
      editManillaDto.matricula_o_tarjeta = manilla.matricula_o_tarjeta;     
    }
    if (editManillaDto.factura) {
      manilla.factura = await this.processAndUploadUpdateField(manilla, 'factura', editManillaDto.factura);
      editManillaDto.factura = manilla.factura;      
    }
    if (editManillaDto.seguro) {
      manilla.seguro = await this.processAndUploadUpdateField(manilla, 'seguro', editManillaDto.seguro);
      editManillaDto.seguro = manilla.seguro;
      
    }
    if (editManillaDto.tenencias) {
      manilla.tenencias = await this.processAndUploadUpdateField(manilla, 'tenencias', editManillaDto.tenencias);
      editManillaDto.tenencias = manilla.tenencias;
     
    }
    if(editManillaDto.historia_clinica){
      manilla.historia_clinica = await this.processAndUploadUpdateField(manilla, 'historia_clinica', editManillaDto.historia_clinica);
      editManillaDto.historia_clinica = manilla.historia_clinica;      
    }
    if(editManillaDto.archivos){
      manilla.archivos = await this.processAndUploadUpdateField(manilla, 'archivos', editManillaDto.archivos);
      editManillaDto.archivos = manilla.archivos;
     
    }
    Object.assign(manilla, editManillaDto);

    //actualizar la manilla en la base de datos

    const manillaEditada = await this.manillaModel.findByIdAndUpdate(id, manilla, { new: true }).exec();

    return {
      message: 'informacion editada satisfactoriamente',
      manillaEditada
    }




  }



  // async uploadBase64ToS3(id: string, base64Data: string, field: string, extension: string): Promise<string> {
  //   const buffer = Buffer.from(base64Data, 'base64');


  //   let content = '';
  //   if (extension == 'pdf') {
  //     content = 'application/pdf'
  //   } else {
  //     content = 'image' + '/' + extension;
  //   }






  //   const uploadFolderPath = 'portador'; // Carpeta base en S3
  //   const fileName = `portador/${id}/${field}`; // Nombre de archivo


  //   console.log(fileName, extension)

  //   const s3Params: AWS.S3.PutObjectRequest = {
  //     Bucket: this.configSerivce.s3.bucket,
  //     Key: fileName + '.' + extension,
  //     Body: buffer,
  //     ContentType: content
  //   };

  //   try {
  //     // const data = await this.s3.putObject(s3Params).promise();
  //     // const urlfoto = this.s3.getSignedUrl('getObject', {
  //     //   Bucket: this.configSerivce.s3.bucket,
  //     //   Key: `${fileName}`

  //     // });


  //     const uploadedObject = await this.s3.upload(s3Params).promise();

  //     // Obtener la URL del objeto recién subido
  //     // const urlqr = this.s3.getSignedUrl('getObject', {
  //     //   Bucket: this.configSerivce.s3.bucket,
  //     //   Key: `${dailyFolderPath}/${fileName}`       
  //     // });

  //     const urlfoto = uploadedObject.Location

  //     console.log('urlfoto', urlfoto)


  //     //return `https://${this.configService.s3.bucket}.s3.${this.configService.s3.region}.amazonaws.com/${fileName}`;
  //     return urlfoto;

  //   } catch (error) {
  //     throw new Error(`Error al subir la imagen a S3: ${error.message}`);
  //   }
  // }


  async changeEstadoPago(id: string) {

    const manilla = await this.manillaModel.findById(id).exec();

    if (!manilla) {
      throw new ConflictException('No se encontro la manilla')
    }

    await this.manillaModel.findByIdAndUpdate(id, { estadoPago: true }).exec();

    return


  }



  async findSolicitudes(params?: FilterManillaDto) {
    //obtener todas las manillas que tenga el estado Solicitada paginadas con el limit y offset de params

    const [manillas, totalDocuments] = await Promise.all([
      this.manillaModel
        .find({ estado: estadoManilla.Solicitada, estadoPago: true })
        .skip(params.offset * params.limit)
        .limit(params.limit)
        .populate({ path: 'userId', select: 'name' })
        .populate({ path: 'pagoId', select: 'estado', options: { retainNullValues: true } })
        .exec(),
      this.manillaModel.countDocuments({ estado: estadoManilla.Solicitada, estadoPago: true }).exec(),
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
        .skip(params.offset * params.limit)
        .limit(params.limit)
        .populate({ path: 'userId', select: 'name' })
        .populate({ path: 'pagoId', select: 'estado', options: { retainNullValues: true } })
        .exec(),
      this.manillaModel.countDocuments({ estado: estadoManilla.Aceptada, createdAt: { $gte: horaInicio, $lte: horaFin } }).exec(),
    ]);


    //las resagadas son las que fueron aceptadas antes de hoy y no han sido entregadas, a excepcion de las que fueron aceptadas hoy

    const [manillasResagadas, totalDocumentsResagadas] = await Promise.all([
      this.manillaModel
        .find({ estado: estadoManilla.Aceptada, createdAt: { $lt: horaInicio } })
        .skip(params.offset * params.limit)
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

  async findById(id: number) {
    try {
      //const manilla = await this.manillaModel.findById(id).populate({ path: 'userId', select: 'name' })
      const manilla = await this.manillaModel.findOne({ numid: id }).populate({ path: 'userId', select: 'name' }).populate({ path: 'pagoId', select: 'estado metodo', options: { retainNullValues: true } })
      if (!manilla) {
        throw new NotFoundException('Pulsera no encontrada');
      }

      if (manilla.tipo === Tipos.Motero) {
        manilla.entradas = await this.entradaService.findByPlaca(manilla.placa);

      }

      // const pago = await this.pagosService.findPagobyManilla(manilla._id.toString());

      // const retornar = {...manilla, pago: pago}  

      // console.log(retornar.pago)



      return manilla;

    } catch (error) {
      throw new NotFoundException('Pulsera no encontrada' + error);

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
        .skip(offset * limit)
        .limit(limit)
        .populate({ path: 'userId', select: 'name' })
        .populate({ path: 'pagoId', select: 'estado', options: { retainNullValues: true } })
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

  // async aceptarManilla(id: string) {
  //   try {
  //     const exist = await this.manillaModel.findById(id).exec();

  //     if (!exist) {
  //       throw new NotFoundException('No existe la manilla');
  //     }

  //     const estado = exist.estado;
  //     if ([estadoManilla.Aceptada, estadoManilla.Entregada, estadoManilla.Rechazada, estadoManilla.Enviada].includes(estado)) {
  //       throw new ConflictException(`La manilla ya fue ${estado}`);
  //     }


  //     const idnum = exist.numid;

  //     const urlFront = this.configSerivce.frontend.url;
  //     const urlInfo = this.configSerivce.frontend.urlinfo;
  //     const url = `${urlFront}/${urlInfo}/${idnum}`;

  //     const qrData = url;
  //     const qrOptions = { type: 'png', errorCorrectionLevel: 'high', scale: 8 };     
  //     const qrCodeSvg = await qr.toString(qrData, qrOptions);

  //     // Guardar el archivo SVG en disco (opcional)
  //     //fs.writeFileSync(`manilla_${id}.png`, qrCodeSvg);

  //     // Aquí, subir el SVG a S3 (implementar esta funcionalidad)
  //     const uploadFolderPath = 'uploads';
  //     const currentDate = new Date();
  //     const formattedDate = format(currentDate, 'yyyy-MM-dd');
  //     const dailyFolderPath = `${uploadFolderPath}/${formattedDate}`;
  //     const fileName = `manilla_${id}.svg`;
  //     //const fileName = `manilla_${id}.png`;

  //     // Subir el archivo SVG al S3
  //     const s3Params: AWS.S3.PutObjectRequest = {
  //       Bucket: this.configSerivce.s3.bucket,
  //       Key: `${dailyFolderPath}/${fileName}`,
  //       Body: qrCodeSvg,
  //       ContentType: 'image/svg+xml', // Establecer el tipo de contenido correcto
  //       // ContentType: 'image/png'
  //     };




  //     const uploadedObject = await this.s3.upload(s3Params).promise();
  //     const urlqr = uploadedObject.Location







  //     // const urlqr = this.s3.getSignedUrl('getObject', {
  //     //   Bucket: this.configSerivce.s3.bucket,
  //     //   Key: `${dailyFolderPath}/${fileName}`

  //     // });

  //     const imgPng = await this.svgToPng(qrCodeSvg);

  //     const params = {
  //       Bucket: this.configSerivce.s3.bucket,
  //       Key: `${dailyFolderPath}/${fileName}.png`,
  //       Body: imgPng,
  //       ContentType: 'image/png',
  //     };

  //     const uploadedObjectPng = await this.s3.upload(params).promise();

  //     const urlpng = uploadedObjectPng.Location





  //     await exist.populate({ path: 'userId', select: 'name email' })

  //     const email = exist.userId.email;
  //     const name = exist.userId.name;




  //     await this.mailService.sendQrCodeEmail(email, urlpng, name);




  //     exist.estado = estadoManilla.Aceptada;
  //     exist.qrCode = urlqr;
  //     //exist.qrdxf = urldxf;
  //     const manilla = await exist.save();

  //     return {
  //       message: 'Manilla aceptada satisfactoriamente',
  //       manilla,
  //       //qrCodeSvg,
  //     };
  //   } catch (error) {
  //     throw new ConflictException('No se pudo aceptar la manilla: ' + error.message);
  //   }
  // }



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


      const idnum = exist.numid;

      const urlFront = this.configSerivce.frontend.url;
      const urlInfo = this.configSerivce.frontend.urlinfo;
      const url = `${urlFront}/${urlInfo}/${idnum}`;

      const qrData = url;
      const qrOptions = { type: 'svg', errorCorrectionLevel: 'high', scale: 8 };
      const qrCodeSvg = await qr.toString(qrData, qrOptions);


      const imgPng = await this.svgToPng(qrCodeSvg);

      // Guardar el archivo SVG en disco (opcional)
      //fs.writeFileSync(`manilla_${id}.png`, qrCodeSvg);

      // Aquí, subir el SVG a S3 (implementar esta funcionalidad)
      const uploadFolderPath = 'uploads';
      const currentDate = new Date();
      const formattedDate = format(currentDate, 'yyyy-MM-dd');
      const dailyFolderPath = `${uploadFolderPath}/${formattedDate}`;
      const fileName = `manilla_${id}.png`;
      //const fileName = `manilla_${id}.png`;

      // Subir el archivo SVG al S3
      const s3Params: AWS.S3.PutObjectRequest = {
        Bucket: this.configSerivce.s3.bucket,
        Key: `${dailyFolderPath}/${fileName}`,
        Body: imgPng,
        //ContentType: 'image/svg+xml', // Establecer el tipo de contenido correcto
        ContentType: 'image/png'
      };
      // const imgPng = await this.svgToPng(qrCodeSvg);

      const uploadedObject = await this.s3.upload(s3Params).promise();
      const urlqr = uploadedObject.Location

      //convertio usando la api de convertio

      const respuestaConvertio = await this.convertioService.newConversion(urlqr);
      if (respuestaConvertio.status !== 'ok') {
        console.log('entro al 1 if')
        throw new ConflictException('No se pudo aceptar la manilla, error al convertir el qr a dxf')
      }
      let status = 'convert'

      while (status == 'convert') {
        const statusConvertio = await this.convertioService.getConversionStatus(respuestaConvertio.data.id);

        console.log('step ', statusConvertio.data.step, ' step_percent', statusConvertio.data.step_percent)


        if (statusConvertio.data.step === 'finish') {
          status = 'finish'

        }

        // Pausa durante un período de tiempo antes de la siguiente consulta (puedes ajustar este valor)
        //await this.sleep(5000); // Esperar 5 segundos antes de la siguiente consulta
      }
      //const statusConvertio = await this.convertioService.getConversionStatus(respuestaConvertio.data.id);
      const dataConvertio = await this.convertioService.getConversionData(respuestaConvertio.data.id);

      if (dataConvertio.status !== 'ok') {
        console.log('entro al 2 if')
        throw new ConflictException('no se pudo aceptar la manilla, error al obtener el dxf')
      }

      const base64 = await dataConvertio.data.content;

      const buffer = Buffer.from(base64, 'base64');

      //subir el base 64 que es un dxf a s3

      const fileNamedxf = `manilla_${id}.dxf`;

      const params = {
        Bucket: this.configSerivce.s3.bucket,
        Key: `${dailyFolderPath}/${fileNamedxf}`,
        Body: buffer,
        //ContentType: 'application/dxf',
      };

      const uploadedObjectDxf = await this.s3.upload(params).promise();

      const urldxf = uploadedObjectDxf.Location
      await exist.populate({ path: 'userId', select: 'name email' })

      const email = exist.userId.email;
      const name = exist.userId.name;

      await this.mailService.sendQrCodeEmail(email, urlqr, name);
      exist.estado = estadoManilla.Aceptada;
      exist.qrCode = urlqr;
      exist.qrdxf = urldxf;
      const manilla = await exist.save();

      return {
        message: 'Manilla aceptada satisfactoriamente',
        manilla,
        //qrCodeSvg,
      };
    } catch (error) {
      throw new ConflictException('No se pudo aceptar la manilla: ' + error.message + error);
    }
  }


  async enviarManilla(id: string) {

    const exist = await this.manillaModel.findById(id).exec();

    if (!exist) {
      throw new NotFoundException('No existe la manilla');
    }

    const estado = exist.estado;
    if ([estadoManilla.Entregada, estadoManilla.Rechazada, estadoManilla.Enviada].includes(estado)) {
      throw new ConflictException(`La manilla ya fue ${estado}`);
    }

    exist.estado = estadoManilla.Enviada;

    const manilla = await exist.save();

    return {
      message: 'Manilla enviada satisfactoriamente',
      manilla,
    };


  }

  //cambiar el estado de la manilla a enviada o entregada, basicamente la misma funcion que enviarManilla solo que ahora recibe el estado por parametro para no tener que crear otra funcion

  async cambiarEstadoManilla(id: string, estado: estadoManilla) {

    //verificar que el estado sea valido

    if (![estadoManilla.Entregada, estadoManilla.Enviada, estadoManilla.Rechazada].includes(estado)) {
      throw new ConflictException(`El estado ${estado} no es valido`);
    }

    const exist = await this.manillaModel.findById(id).exec();

    if (!exist) {
      throw new NotFoundException('No existe la manilla');
    }

    const estadoActual = exist.estado;

    if (estadoActual === estado) {
      throw new ConflictException(`La manilla ya fue ${estado}`);
    }

    exist.estado = estado;
    await exist.save();

    //si el estado es entregada o enviada entonces enviar el correo
    await exist.populate({ path: 'userId', select: 'name email' })

    const email = exist.userId.email;
    const name = exist.userId.name;

    if ([estadoManilla.Enviada].includes(estado)) {
      await this.mailService.sendPulseraEnviada(email, name);
    } else if ([estadoManilla.Entregada].includes(estado)) {
      await this.mailService.sendPulseraEntregada(email, name);
    }




    return {
      message: 'Estado de la pulsera cambiado satisfactoriamente',
      manilla: exist,
    };
  }




  async svgToPng(svgXml: string,): Promise<Buffer> {
    const width = 500
    const height = 500


    const pngBuffer = await sharp(Buffer.from(svgXml))
      .resize(width, height)  // Agrega esta línea para redimensionar la imagen
      .toFormat('png')
      .toBuffer();

    return pngBuffer;
  }

  //funcion para traer el ultimo numId de el ultimo registro de manilla

  async findLastNumId() {

    const lastManilla = await this.manillaModel.findOne().sort({ numid: -1 }).exec();

    if (!lastManilla) {
      return 0;
    }

    return lastManilla.numid;


  }





  async cambiarestadoVarias(ids: string[], estado: estadoManilla): Promise<{ manillas: any[], errores: string[] }> {
    const manillas: any[] = [];
    const errores: string[] = [];

    for (const id of ids) {
      try {
        const manilla = await this.cambiarEstadoManilla(id, estado);
        manillas.push(manilla.manilla);
      } catch (error) {
        errores.push(`Error al enviar la Pulsera ${id}: ${error.message}`);
      }
    }

    return {
      manillas,
      errores,
    };
  }




  async aceptarVariasManillas(ids: string[]): Promise<{ aceptadas: any[], errores: string[] }> {



    const total = ids.length;

    const minutos_convertio = await this.convertioService.balance();





    if (total > minutos_convertio.data.minutes_left) {

      throw new ConflictException(`No se pueden aceptar las manillas, no hay suficientes minutos en convertio, minutos disponibles: ${minutos_convertio.data.minutes_left}`);

    }







    const aceptadas: any[] = [];
    const errores: string[] = [];

    for (const id of ids) {
      try {
        const manilla = await this.aceptarManilla(id);
        aceptadas.push(manilla.manilla);
      } catch (error) {
        errores.push(`Error al aceptar la Pulsera ${id}: ${error.message}`);
      }
    }

    return {
      aceptadas,
      errores,
    };
  }



  async aceptarTodasLasManillas(): Promise<{ aceptadas: any[], errores: string[] }> {

    const manillas = await this.manillaModel.find({ estado: estadoManilla.Solicitada, estadoPago: true }).exec();

    if (!manillas) {
      throw new NotFoundException('No existen pulseras solicitadas');
    }

    const ids = manillas.map((manilla) => manilla._id.toString());

    const aceptadas = await this.aceptarVariasManillas(ids);

    return aceptadas;

  }








  async obtenerMisManillasAgrupadasPorTipo(userId: string, params?: FilterManillaDto) {

    // const filters: FilterQuery<Manilla> = {};
    // const { limit, offset } = params;

    // console.log(offset, limit)

    try {
      const misManillas =
        await this.manillaModel.aggregate([
          { $match: { userId: userId } },
          { $group: { _id: '$tipo', manillas: { $push: '$$ROOT' }, } },
        ])

      //const misManillas = await this.manillaModel.find({ userId: userId }).skip(offset).limit(limit).exec();

      const totalDocuments = await this.manillaModel.countDocuments({ userId: userId }).exec();


      return {
        misManillas
      }



    } catch (error) {
      throw new ConflictException('Error al obtener las pulseras agrupadas por tipo' + error.message);
    }
  }



  async obtenerInfoMotoPorPlaca(placa: string, tallerid: string) {

    const manilla = await this.manillaModel.findOne({ placa: placa }).populate({ path: 'userId', select: 'name' })

    if (!manilla) {
      throw new NotFoundException('No existe ninguna pulsera asociada a la placa proporcionada');
    }

    const entradas = await this.entradaService.findByPlacaAndTaller(placa, tallerid);


    const infoRetorno = {

      placa: manilla.placa,
      marca: manilla.marca,
      cilindraje: manilla.cilindraje,
      conductor: manilla.userId.name,
      entradas: entradas,

    }
    return infoRetorno;
  }


  async crearEntradaManilla(placa: string, createEntradaManillaDto: CreateEntradaDto, userId: string) {

    const manilla = await (await this.manillaModel.findOne({ placa: placa }).populate({ path: 'userId', select: 'name' }))

    if (!manilla) {
      throw new NotFoundException('No existe ninguna pulsera asociada a la placa proporcionada');
    }

    const entrada = {
      taller: userId,
      observaciones: createEntradaManillaDto.observaciones,
      placa: placa,
      manilla: manilla._id
    }

    console.log('entrada', entrada)
    const entradaCreada = await this.entradaService.create(entrada);

    const entradas = await this.entradaService.findByPlacaAndTaller(placa, userId);



    const infoRetorno = {

      placa: manilla.placa,
      marca: manilla.marca,
      cilindraje: manilla.cilindraje,
      conductor: manilla.userId.name,
      entradas: entradas
    }


    return infoRetorno;





  }


  //funcion que me trae el total de manillas por tipo en un rango de fechas

  async obtenerManillasPorTipo(fechaInicialFormateada, fechaFinalFormateada) {


    const manillas = await this.manillaModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: fechaInicialFormateada,
            $lte: fechaFinalFormateada
          }
        }
      },
      {
        $group: {
          _id: '$tipo',
          total: { $sum: 1 }

        }
      },
      {
        $project: {
          _id: 0,
          tipo: '$_id',
          total: 1
        }
      }])

    return manillas;








  }


  async obtenerManillasPorEstado(fechaInicialFormateada, fechaFinalFormateada) {

    const manillas = await this.manillaModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: fechaInicialFormateada,
            $lte: fechaFinalFormateada
          }
        }
      },
      {
        $group: {
          _id: '$estado',
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          estado: '$_id',
          total: 1
        }
      }])

    return manillas;



  }





  async obtenerReporteTotal() {


    const pulseras = await this.manillaModel.find({}, { _id: 0, __v: 0, foto_portador: 0, licencia: 0, matricula_o_tarjeta: 0, factura: 0, seguro: 0, tenencias: 0, qrCode: 0, entradas: 0 }).populate('userId').exec();

    for (const pulsera of pulseras) {
      pulsera.distribuidor = pulsera.userId['distribuidor'] as any || '';
      pulsera.userId = pulsera.userId['email'] as any;
    }

    return pulseras;
  }



  async actualizarPago(id: string, idPago: string) {

    if (!idPago || idPago == null || idPago == undefined) {
      throw new ConflictException('No se recibio el id del pago');
    }

    const manilla = await this.manillaModel.findById(id).exec();

    if (!manilla) {
      throw new NotFoundException('No existe la manilla');
    }

    if (manilla.pagoId != null) {
      throw new ConflictException('el pago ya fue realizado');
    }



    await this.manillaModel.findByIdAndUpdate(id, { pagoId: idPago }).exec();

    const manillaupdate = await this.manillaModel.findById(id).populate({ path: 'pagoId', select: 'estado metodo' }).exec()


    return {
      message: 'Pago actualizado satisfactoriamente',
      manilla: manillaupdate

    }



  }



  async getManillaByIdPago(idPago: string) {

    const manilla = await this.manillaModel.findOne({ pagoId: idPago }).populate({ path: 'pagoId', select: 'estado metodo' }).exec()

    if (!manilla) {
      throw new NotFoundException('No existe la manilla');
    }


    return manilla;






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
