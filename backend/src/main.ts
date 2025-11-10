import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
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

  // Verificar conexión a MongoDB antes de continuar
  try {
    const connection = app.get<Connection>(getConnectionToken());
    const dbState = connection.readyState;
    
    if (dbState === 1) {
      Logger.log('✅ MongoDB conectado y listo', 'Bootstrap');
      Logger.log(`📊 Base de datos: ${connection.db?.databaseName || 'N/A'}`, 'Bootstrap');
    } else if (dbState === 0) {
      Logger.warn('⚠️  MongoDB desconectado, esperando conexión...', 'Bootstrap');
      // Esperar hasta 10 segundos por la conexión
      let attempts = 0;
      while (connection.readyState !== 1 && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }
      if (connection.readyState === 1) {
        Logger.log('✅ MongoDB conectado después de esperar', 'Bootstrap');
      } else {
        Logger.error('❌ MongoDB no se pudo conectar después de 10 segundos', 'Bootstrap');
        Logger.error(`Estado de conexión: ${dbState} (0=desconectado, 1=conectado, 2=conectando, 3=desconectando)`, 'Bootstrap');
      }
    } else {
      Logger.warn(`⚠️  Estado de MongoDB: ${dbState} (0=desconectado, 1=conectado, 2=conectando, 3=desconectando)`, 'Bootstrap');
    }
  } catch (error) {
    Logger.error(`❌ Error verificando conexión a MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`, 'Bootstrap');
  }

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
