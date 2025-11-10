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

  // CORS configurado ANTES de Helmet (importante para que funcione correctamente)
  // Permitir múltiples orígenes: frontend URL configurada, localhost, y cualquier URL de Railway
  const allowedOrigins = [
    frontendUrl,
    'http://localhost:3000',
    'https://localhost:3000',
    /^https:\/\/.*\.up\.railway\.app$/,
    /^https:\/\/.*\.railway\.app$/,
  ];
  
  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (ej: Postman, mobile apps)
      if (!origin) {
        return callback(null, true);
      }
      
      // Verificar si el origin está en la lista permitida
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        if (typeof allowedOrigin === 'string') {
          return origin === allowedOrigin;
        }
        if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return false;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        Logger.warn(`🚫 CORS bloqueado para origin: ${origin}`, 'CORS');
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  });

  // Seguridad: Helmet para headers HTTP seguros (configurado para no bloquear CORS)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // Deshabilitar CSP para evitar problemas con CORS
    })
  );

  // Compresión de respuestas
  app.use(compression());

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

  // Middleware para logging de requests (solo en desarrollo o para debugging)
  app.use((req: any, res: any, next: () => void) => {
    Logger.log(`📥 ${req.method} ${req.url}`, 'Request');
    Logger.log(`🌐 Origin: ${req.headers.origin || 'N/A'}`, 'Request');
    Logger.log(`🔑 Authorization: ${req.headers.authorization ? 'Present' : 'Missing'}`, 'Request');
    next();
  });

  // Escuchar en 0.0.0.0 para aceptar conexiones externas (importante para Railway)
  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 Aplicación ejecutándose en: http://0.0.0.0:${port}/api`, 'Bootstrap');
  Logger.log(`📚 Documentación Swagger en: http://0.0.0.0:${port}/api/docs`, 'Bootstrap');
  Logger.log(`🌐 CORS configurado para: ${frontendUrl} y URLs de Railway`, 'Bootstrap');
  Logger.log(
    `🗄️  Base de datos: ${configService.get('MONGODB_URI')?.split('@')[1]?.split('?')[0]}`,
    'Bootstrap'
  );
}

bootstrap();
