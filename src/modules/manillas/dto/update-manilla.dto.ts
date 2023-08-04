import { PartialType } from '@nestjs/mapped-types';
import { CreateManillaDto } from './create-manilla.dto';

export class UpdateManillaDto extends PartialType(CreateManillaDto) {}
