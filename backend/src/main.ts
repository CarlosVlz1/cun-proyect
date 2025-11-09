import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { createLogger } from './config/winston.config';

async function bootstrap() {
  // Logger configurado con Winston
  const logger = createLogger();

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: logger,
    }),
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3000');

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  // Seguridad: Helmet para headers HTTP seguros
  app.use(helmet());

  // Compresión de respuestas
  app.use(compression());

  // CORS configurado
  app.enableCors({
    origin: [frontendUrl, 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Validación global con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      transform: true, // Transforma automáticamente tipos
      transformOptions: {
        enableImplicitConversion: true, // Conversión implícita de tipos
      },
    })
  );

  // Documentación Swagger
  const config = new DocumentBuilder()
    .setTitle('API Sistema de Gestión de Tareas')
    .setDescription(
      'API RESTful completa para gestión de tareas cumpliendo con ISO 25010. ' +
        'Incluye autenticación JWT, CRUD de tareas, búsqueda avanzada, ' +
        'estadísticas y exportación de datos.'
    )
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticación y registro')
    .addTag('users', 'Gestión de usuarios y perfiles')
    .addTag('tasks', 'CRUD de tareas y operaciones relacionadas')
    .addTag('statistics', 'Estadísticas y métricas de productividad')
    .addTag('backup', 'Backup, restauración y exportación de datos')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingrese el token JWT obtenido del login',
      },
      'JWT-auth'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'API Docs - Sistema Tareas',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(port);

  Logger.log(`🚀 Aplicación ejecutándose en: http://localhost:${port}/api`, 'Bootstrap');
  Logger.log(`📚 Documentación Swagger en: http://localhost:${port}/api/docs`, 'Bootstrap');
  Logger.log(
    `🗄️  Base de datos: ${configService.get('MONGODB_URI')?.split('@')[1]?.split('?')[0]}`,
    'Bootstrap'
  );
}

bootstrap();
