import { Module } from '@nestjs/common';
import { ErrorsService } from './errors.service';
import { ErrorLoggerService } from './error-logger.service';
import { ErrorsLoggerController } from './errors.controller';


@Module({
  imports: [],
  controllers: [ErrorsLoggerController],
  providers: [
    ErrorsService,
    ErrorLoggerService
  ],
  exports: [
    ErrorsService,
    ErrorLoggerService
  ]

})
export class ErrorsModule {}
