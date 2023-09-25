import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from 'src/config';
import { ParametrosService } from '../parametros/parametros.service';

@Injectable()
export class ConvertioService {



    constructor(
        @Inject(config.KEY) private readonly configSerivce: ConfigType<typeof config>,
        private readonly httpService: HttpService,
        private readonly parametrosService: ParametrosService
    ) {
    }



    // accessKeyId: this.configSerivce.s3.accessKeyId,


    async newConversion(file){

       


        const apiKey =await  this.parametrosService.findOneByName('apikeyconvertio')

        console.log(apiKey)
        const ouputformat = 'dxf';

        const url = this.configSerivce.convertio.url + '/convert';


       


        const response = await this.httpService.axiosRef.post(url, {
            apikey: apiKey,  
            input: 'url' ,        
            file: file,
            outputformat: ouputformat,
            wait: true
        });

        return response.data;




    }



    async getConversionData(id){
        


       
        const url = this.configSerivce.convertio.url + '/convert/' + id + '/dl';

        const response = await this.httpService.axiosRef.get(url, {           
        });

        return response.data;

    }



    async getConversionStatus(id){

        const url = this.configSerivce.convertio.url + '/convert/' + id + '/status';

        const response = await this.httpService.axiosRef.get(url, {           
        });

        return response.data;



    }



    async balance(){

        const apiKey =await  this.parametrosService.findOneByName('apikeyconvertio')

        const url = this.configSerivce.convertio.url + '/balance';

        const response = await this.httpService.axiosRef.post(url, {
            apikey: apiKey,  
        });

        return response.data;



    }


}
