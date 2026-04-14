import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('FutureKawa Back Central')
    .setDescription(
      "API REST du siege FutureKawa. Cette documentation explique chaque endpoint en francais: ce qu'il retourne et pourquoi il existe dans le pilotage central des lots.",
    )
    .setVersion('1.0.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    swaggerOptions: {
      docExpansion: 'list',
    },
    customSiteTitle: 'FutureKawa API Docs',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
