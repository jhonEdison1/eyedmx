import { Controller } from '@nestjs/common';
import { ConvertioService } from './convertio.service';

@Controller('convertio')
export class ConvertioController {
  constructor(private readonly convertioService: ConvertioService) {}
}
