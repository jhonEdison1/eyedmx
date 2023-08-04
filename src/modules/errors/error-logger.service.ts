import { HttpStatus, Injectable } from "@nestjs/common";
import * as winston from "winston";
import * as fs from 'fs';

@Injectable()
export class ErrorLoggerService {

    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                //new winston.transports.Console(),
                new winston.transports.File({ filename: 'logs/error.log' })
            ]
        });
    }


    CreateErrorLog(message: string, trace?: any | string) {
        this.logger.error(message, trace);
    }


    getAllErrorLogs(): string[]{
        try {
            const errorLogsContent = fs.readFileSync('logs/error.log', 'utf8');
            const errorLogsLines = errorLogsContent.split('\n');

            const jsonObjectArray = errorLogsLines
            .filter(jsonString => jsonString.trim() !== '')
            .map((jsonString) => JSON.parse(jsonString.replace(/\r/g, ""))); // Reemplazamos /r por cadena vacía

            return jsonObjectArray;
            
        } catch (error) {
            this.CreateErrorLog("No se pudo acceder al archivo error.log", HttpStatus.REQUEST_TIMEOUT);
            
        }
    }


    clearErrorLog() {
        const filePath = "logs/error.log";
        try {
          /** Abrimos el archivo en modo escritura para borrar su contenido */
          fs.writeFileSync(filePath, "");
    
          return { messge: "el contenido se elimino correctamente" };
        } catch (error) {
          /** Indicamos que hubio un error al eliminar el contenido */
          this.CreateErrorLog("error al borrar el contecnido del archivo de registro de errores", HttpStatus.REQUEST_TIMEOUT);
          return;
        }
      }

}