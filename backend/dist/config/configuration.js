"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
const configuration = () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '4000', 10),
    database: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/tareas_db',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'super-secret-jwt-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    frontend: {
        url: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
    throttle: {
        ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
        limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
    },
});
exports.configuration = configuration;
//# sourceMappingURL=configuration.js.map