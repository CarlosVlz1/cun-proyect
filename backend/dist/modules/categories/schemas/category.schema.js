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
exports.CategorySchema = exports.Category = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
let Category = class Category {
};
exports.Category = Category;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de la categoría',
        example: 'Trabajo',
    }),
    (0, mongoose_1.Prop)({ required: true, trim: true, minlength: 1, maxlength: 50 }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Color de la categoría en formato hexadecimal',
        example: '#3B82F6',
    }),
    (0, mongoose_1.Prop)({
        required: true,
        match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    }),
    __metadata("design:type", String)
], Category.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción opcional de la categoría',
        example: 'Tareas relacionadas con el trabajo',
        required: false,
    }),
    (0, mongoose_1.Prop)({ default: '', maxlength: 200 }),
    __metadata("design:type", String)
], Category.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Icono de la categoría (nombre de Lucide)',
        example: 'briefcase',
        required: false,
    }),
    (0, mongoose_1.Prop)({ default: 'folder' }),
    __metadata("design:type", String)
], Category.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario propietario',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Category.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de creación' }),
    __metadata("design:type", Date)
], Category.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de última actualización' }),
    __metadata("design:type", Date)
], Category.prototype, "updatedAt", void 0);
exports.Category = Category = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Category);
exports.CategorySchema = mongoose_1.SchemaFactory.createForClass(Category);
exports.CategorySchema.index({ name: 1, user: 1 }, { unique: true });
exports.CategorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});
exports.CategorySchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
//# sourceMappingURL=category.schema.js.map