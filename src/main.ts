import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("eyedmx");
  app.useGlobalPipes(new ValidationPipe(
    {
      //whitelist: true,
      //forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      }
    }    
  ));

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const config = new DocumentBuilder().setTitle('EyedMX API').setDescription('The EyedMX API description').setVersion('1.0').addTag('eyedmx').build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  app.enableCors();
  await app.listen(4000);
}
bootstrap();
