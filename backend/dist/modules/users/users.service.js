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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const user_schema_1 = require("./schemas/user.schema");
let UsersService = UsersService_1 = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async create(createUserDto) {
        try {
            const existingUser = await this.userModel.findOne({
                $or: [{ email: createUserDto.email }, { username: createUserDto.username }],
            });
            if (existingUser) {
                if (existingUser.email === createUserDto.email) {
                    throw new common_1.ConflictException('El correo electrónico ya está registrado');
                }
                if (existingUser.username === createUserDto.username) {
                    throw new common_1.ConflictException('El nombre de usuario ya está en uso');
                }
            }
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            const createdUser = new this.userModel({
                ...createUserDto,
                password: hashedPassword,
            });
            const savedUser = await createdUser.save();
            this.logger.log(`Usuario creado exitosamente: ${savedUser.username}`);
            return this.findById(savedUser.id);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error al crear usuario: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al crear el usuario');
        }
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email, isActive: true }).select('+password').exec();
    }
    async findByUsername(username) {
        return this.userModel.findOne({ username, isActive: true }).select('+password').exec();
    }
    async findById(id) {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        return user;
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.userModel.find({ isActive: true }).skip(skip).limit(limit).exec(),
            this.userModel.countDocuments({ isActive: true }),
        ]);
        return {
            users,
            total,
            pages: Math.ceil(total / limit),
        };
    }
    async update(id, updateUserDto) {
        try {
            const updateData = { ...updateUserDto };
            if (updateUserDto.theme ||
                updateUserDto.language ||
                updateUserDto.notifications ||
                updateUserDto.dateFormat) {
                const user = await this.findById(id);
                updateData.preferences = {
                    ...user.preferences,
                    ...(updateUserDto.theme && { theme: updateUserDto.theme }),
                    ...(updateUserDto.language && { language: updateUserDto.language }),
                    ...(updateUserDto.notifications !== undefined && {
                        notifications: updateUserDto.notifications,
                    }),
                    ...(updateUserDto.dateFormat && { dateFormat: updateUserDto.dateFormat }),
                };
                delete updateData.theme;
                delete updateData.language;
                delete updateData.notifications;
                delete updateData.dateFormat;
            }
            const user = await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
            if (!user) {
                throw new common_1.NotFoundException('Usuario no encontrado');
            }
            this.logger.log(`Usuario actualizado: ${user.username}`);
            return user;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error al actualizar usuario: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al actualizar el usuario');
        }
    }
    async updatePassword(id, updatePasswordDto) {
        const user = await this.userModel.findById(id).select('+password').exec();
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const isPasswordValid = await bcrypt.compare(updatePasswordDto.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('La contraseña actual es incorrecta');
        }
        const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
        await this.userModel.findByIdAndUpdate(id, { password: hashedPassword });
        this.logger.log(`Contraseña actualizada para usuario: ${user.username}`);
    }
    async updateLastLogin(id) {
        await this.userModel.findByIdAndUpdate(id, { lastLogin: new Date() });
    }
    async remove(id) {
        const user = await this.userModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        this.logger.log(`Usuario desactivado: ${user.username}`);
    }
    async hardDelete(id) {
        const result = await this.userModel.findByIdAndDelete(id);
        if (!result) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        this.logger.warn(`Usuario eliminado permanentemente: ${result.username}`);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map