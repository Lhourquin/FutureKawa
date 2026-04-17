import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('FutureKawa Back Central')
    .setDescription(
      "API REST du siege FutureKawa. Endpoints protégés par JWT Bearer sauf /health et /auth/login. Utilisez POST /auth/login pour obtenir un token.",
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    swaggerOptions: {
      docExpansion: 'list',
    },
    customSiteTitle: 'FutureKawa API Docs',
  });

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
