import { ArgumentMetadata, ConflictException, Injectable, PipeTransform } from "@nestjs/common";
import { IsMongoId } from "class-validator";

@Injectable()
export class MongoIdPipe implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata) {
        if(!IsMongoId(value)){
            throw new ConflictException(`el id ${value} no es un id valido`);
        }
        return value;
    }

    
}