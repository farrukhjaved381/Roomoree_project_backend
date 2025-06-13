// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // ✅ Create Nest application with Express support
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Serve uploaded images statically (e.g., /uploads/rooms/image.png)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // ✅ Enable CORS (required for frontend)
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  // ✅ Global validation pipe for all DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ✅ Swagger (OpenAPI) setup
  const config = new DocumentBuilder()
    .setTitle('Roomoree API')
    .setDescription('Roomoree booking platform API documentation. Use JWT Bearer token for access.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token here (e.g., after login or Google OAuth)',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ✅ Get port from .env or default to 3000
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // ✅ Start server
  await app.listen(port);
  console.log(`🚀 Application running on: ${await app.getUrl()}`);
  console.log(`📘 Swagger docs: ${await app.getUrl()}/api`);
}

bootstrap();
