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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_user_dto_1 = require("./create-user.dto");
const class_validator_1 = require("class-validator");
class UpdateUserDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_user_dto_1.CreateUserDto, ['password', 'email'])) {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tema de la interfaz',
        enum: ['light', 'dark', 'auto'],
        example: 'dark',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['light', 'dark', 'auto'], { message: 'El tema debe ser light, dark o auto' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "theme", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Idioma de la aplicación',
        enum: ['es', 'en'],
        example: 'es',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['es', 'en'], { message: 'El idioma debe ser es o en' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Habilitar o deshabilitar notificaciones',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Las notificaciones deben ser verdadero o falso' }),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "notifications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Formato de fecha preferido',
        example: 'dd/MM/yyyy',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El formato de fecha debe ser texto' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "dateFormat", void 0);
//# sourceMappingURL=update-user.dto.js.map