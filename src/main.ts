// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Import Swagger modules

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with specific origin, methods, and headers
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  // Use ValidationPipe globally for request payload validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Automatically transform payloads to DTO instances
    whitelist: true, // Remove properties not defined in DTOs
    forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are sent
  }));

  // --- Swagger (OpenAPI) Setup ---
  // Create a new DocumentBuilder to configure Swagger options
  const config = new DocumentBuilder()
    .setTitle('Roomoree API') // Title of your API documentation
    .setDescription('The Roomoree property booking platform API description. Use JWT token for authorized endpoints.') // Description
    .setVersion('1.0') // API version
    .addBearerAuth( // Add JWT Bearer token authentication option
      {
        type: 'http', // Authentication scheme type
        scheme: 'bearer', // Specifies 'Bearer' token type
        bearerFormat: 'JWT', // Specifies JWT format
        name: 'JWT', // Name for the security scheme in Swagger UI
        description: 'Enter your JWT token obtained after login (e.g., Google Sign-In or local login)',
        in: 'header', // Token is expected in the Authorization header
      },
      'JWT-auth', // This name is used to refer to this auth scheme in @ApiSecurity() decorator
    )
    .build(); // Build the Swagger document configuration

  // Create the Swagger document based on the application and configuration
  const document = SwaggerModule.createDocument(app, config);

  // Set up Swagger UI at a specific path (e.g., /api).
  // The interactive documentation will be available at http://localhost:3000/api
  SwaggerModule.setup('api', app, document);
  // --- End Swagger Setup ---

  // Get ConfigService instance to access environment variables
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000; // Get port from .env or default to 3000

  // Start the application and listen for incoming requests
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger UI available at: ${await app.getUrl()}/api`); // Log Swagger UI URL for convenience
}
bootstrap();
