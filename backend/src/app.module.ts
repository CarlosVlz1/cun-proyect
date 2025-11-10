import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// Módulos de la aplicación
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { BackupModule } from './modules/backup/backup.module';

// Configuración
import { configuration } from './config/configuration';
import { validationSchema } from './config/validation.schema';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      envFilePath: ['.env', '.env.development', '.env.production'],
    }),

    // Conexión a MongoDB con Mongoose
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('database.uri');
        console.log('🔌 Intentando conectar a MongoDB...');
        console.log(`📍 URI: ${uri?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`); // Ocultar credenciales en logs
        
        return {
          uri,
          retryAttempts: 5,
          retryDelay: 2000,
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              console.log('✅ MongoDB conectado exitosamente');
              console.log(`📊 Base de datos: ${connection.db?.databaseName || 'N/A'}`);
            });
            connection.on('error', (error: Error) => {
              console.error('❌ Error de conexión a MongoDB:', error.message);
              console.error('Stack:', error.stack);
            });
            connection.on('disconnected', () => {
              console.log('⚠️  MongoDB desconectado');
            });
            connection.on('reconnected', () => {
              console.log('🔄 MongoDB reconectado');
            });
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),

    // Rate limiting para prevenir ataques DDoS
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('throttle.ttl', 60) * 1000,
          limit: configService.get<number>('throttle.limit', 100),
        },
      ],
      inject: [ConfigService],
    }),

    // Módulos de la aplicación
    AuthModule,
    UsersModule,
    TasksModule,
    StatisticsModule,
    BackupModule,
  ],
  providers: [
    // Rate limiting global
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
