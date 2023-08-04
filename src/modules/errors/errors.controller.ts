import { Controller, Get, Post } from '@nestjs/common';
import { ErrorLoggerService } from './error-logger.service';

@Controller('error-log')
export class ErrorsLoggerController {


    constructor(
        
        private readonly errorLoggerService: ErrorLoggerService
    ) { }


    @Get("all")
    getAllErrorLog() {
      const errorList = this.errorLoggerService.getAllErrorLogs();
      return { errorList };
    }
  
    @Post("clear")
    clearAllErrorLog() {
      return this.errorLoggerService.clearErrorLog();
    }

}
