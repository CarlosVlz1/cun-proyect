"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async validateUser(usernameOrEmail, password) {
        try {
            let user;
            if (usernameOrEmail.includes('@')) {
                user = await this.usersService.findByEmail(usernameOrEmail);
            }
            else {
                user = await this.usersService.findByUsername(usernameOrEmail);
            }
            if (!user) {
                return null;
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return null;
            }
            await this.usersService.updateLastLogin(user.id);
            const userObj = user.toObject();
            delete userObj.password;
            return userObj;
        }
        catch (error) {
            this.logger.error(`Error validando usuario: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error.stack : undefined);
            return null;
        }
    }
    async login(user) {
        const payload = {
            sub: user._id || user.id,
            username: user.username,
            email: user.email,
        };
        const accessToken = this.jwtService.sign(payload);
        const expiresIn = this.configService.get('jwt.expiresIn');
        this.logger.log(`Usuario autenticado: ${user.username}`);
        return {
            accessToken,
            tokenType: 'Bearer',
            expiresIn,
            user: {
                id: user._id || user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                avatar: user.avatar,
                preferences: user.preferences,
            },
        };
    }
    async register(registerDto) {
        this.logger.log(`Intentando registrar nuevo usuario: ${registerDto.username}`);
        return this.usersService.create(registerDto);
    }
    async verifyToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Token inválido o expirado');
        }
    }
    async refreshToken(userId) {
        const user = await this.usersService.findById(userId);
        const userObject = user;
        const userIdForPayload = userObject._id?.toString() || userObject.id || userId;
        const payload = {
            sub: userIdForPayload,
            username: user.username,
            email: user.email,
        };
        const accessToken = this.jwtService.sign(payload);
        const expiresIn = this.configService.get('jwt.expiresIn');
        return {
            accessToken,
            tokenType: 'Bearer',
            expiresIn,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map