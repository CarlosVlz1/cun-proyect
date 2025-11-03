import { createLogger as winstonCreateLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors } = format;

// Formato personalizado para logs
const logFormat = printf(({ level, message, timestamp, stack, context }) => {
  const contextStr = context ? `[${context}]` : '';
  return `${timestamp} ${level} ${contextStr} ${stack || message}`;
});

export const createLogger = () => {
  return winstonCreateLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
      errors({ stack: true }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat,
    ),
    transports: [
      // Consola con colores
      new transports.Console({
        format: combine(
          colorize(),
          logFormat,
        ),
      }),
      // Archivo para errores
      new transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      // Archivo para todos los logs
      new transports.File({
        filename: 'logs/combined.log',
      }),
    ],
  });
};

