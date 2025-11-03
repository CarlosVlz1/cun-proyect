"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const winston_1 = require("winston");
const { combine, timestamp, printf, colorize, errors } = winston_1.format;
const logFormat = printf(({ level, message, timestamp, stack, context }) => {
    const contextStr = context ? `[${context}]` : '';
    return `${timestamp} ${level} ${contextStr} ${stack || message}`;
});
const createLogger = () => {
    return (0, winston_1.createLogger)({
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
        transports: [
            new winston_1.transports.Console({
                format: combine(colorize(), logFormat),
            }),
            new winston_1.transports.File({
                filename: 'logs/error.log',
                level: 'error',
            }),
            new winston_1.transports.File({
                filename: 'logs/combined.log',
            }),
        ],
    });
};
exports.createLogger = createLogger;
//# sourceMappingURL=winston.config.js.map