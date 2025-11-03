"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const helmet_1 = require("helmet");
const compression = require("compression");
const app_module_1 = require("./app.module");
const nest_winston_1 = require("nest-winston");
const winston_config_1 = require("./config/winston.config");
async function bootstrap() {
    const logger = (0, winston_config_1.createLogger)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: nest_winston_1.WinstonModule.createLogger({
            instance: logger,
        }),
    });
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT', 4000);
    const frontendUrl = configService.get('FRONTEND_URL', 'http://localhost:3000');
    app.setGlobalPrefix('api');
    app.use((0, helmet_1.default)());
    app.use(compression());
    app.enableCors({
        origin: [frontendUrl, 'http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API Sistema de Gestión de Tareas')
        .setDescription('API RESTful completa para gestión de tareas cumpliendo con ISO 25010. ' +
        'Incluye autenticación JWT, CRUD de tareas, categorías, búsqueda avanzada, ' +
        'estadísticas y exportación de datos.')
        .setVersion('1.0')
        .addTag('auth', 'Endpoints de autenticación y registro')
        .addTag('users', 'Gestión de usuarios y perfiles')
        .addTag('tasks', 'CRUD de tareas y operaciones relacionadas')
        .addTag('categories', 'Gestión de categorías de tareas')
        .addTag('statistics', 'Estadísticas y métricas de productividad')
        .addTag('backup', 'Backup, restauración y exportación de datos')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingrese el token JWT obtenido del login',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'API Docs - Sistema Tareas',
        customfavIcon: 'https://nestjs.com/img/logo-small.svg',
        customCss: '.swagger-ui .topbar { display: none }',
    });
    await app.listen(port);
    common_1.Logger.log(`🚀 Aplicación ejecutándose en: http://localhost:${port}/api`, 'Bootstrap');
    common_1.Logger.log(`📚 Documentación Swagger en: http://localhost:${port}/api/docs`, 'Bootstrap');
    common_1.Logger.log(`🗄️  Base de datos: ${configService.get('MONGODB_URI')?.split('@')[1]?.split('?')[0]}`, 'Bootstrap');
}
bootstrap();
//# sourceMappingURL=main.js.map