import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ErrorLoggerService } from './error-logger.service';

@Injectable()
export class ErrorsService {

    constructor(
       
        private readonly errorLoggerService: ErrorLoggerService
        ) { }

    createError(error: any) {

        this.errorLoggerService.CreateErrorLog('Error en el catch' , error);

        if (error.name === "MongoServerError" && error.code === 11000) {
            throw new ConflictException(`EL ${Object.keys(error.keyValue)} que intentas registrar ya existe`)

        } else {
            throw new ConflictException(error.message)
        }

    }
}






