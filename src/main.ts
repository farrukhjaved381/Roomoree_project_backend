// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { json, urlencoded, raw } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Serve static files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // ✅ ONLY apply raw body to the webhook route
  app.use('/payments/webhook', raw({ type: 'application/json' }));

  // ✅ General body parsers
  app.use(json()); // required for normal JSON routes
  app.use(urlencoded({ extended: true }));

  // ✅ Enable CORS
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  // ✅ Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ✅ Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Roomoree API')
    .setDescription('Roomoree booking platform API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ✅ Start server
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(`🚀 Application running on: ${await app.getUrl()}`);
  console.log(`📘 Swagger docs: ${await app.getUrl()}/api`);
}

bootstrap();
