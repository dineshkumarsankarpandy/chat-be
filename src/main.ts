import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(
    {
      credentials: true,
      origin:['http://localhost:3001'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept, Authorization ,x-skip-toast ,sessionid',

    }
  );
  

  app.useGlobalPipes(new ValidationPipe( { transform : true ,forbidNonWhitelisted: true, whitelist: true} ));
  app.setGlobalPrefix('api');



  const config = new DocumentBuilder()
  .setTitle('Lovable')
  .setDescription('Lovable')
  .setVersion('1.0')
  .addBearerAuth() 
  .addTag('Lovable')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(process.env.APP_PORT ,()=>{
    console.log(`Server is running on port ${process.env.APP_PORT}`);
  });
 
}
bootstrap();
