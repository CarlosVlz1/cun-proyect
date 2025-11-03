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
exports.BulkUpdateOrderDto = exports.TaskOrderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class TaskOrderDto {
}
exports.TaskOrderDto = TaskOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la tarea',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, class_validator_1.IsMongoId)({ message: 'ID de tarea inválido' }),
    __metadata("design:type", String)
], TaskOrderDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nueva posición',
        example: 0,
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'El orden debe ser un número' }),
    __metadata("design:type", Number)
], TaskOrderDto.prototype, "order", void 0);
class BulkUpdateOrderDto {
}
exports.BulkUpdateOrderDto = BulkUpdateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array de tareas con sus nuevas posiciones',
        type: [TaskOrderDto],
    }),
    (0, class_validator_1.IsArray)({ message: 'Debe ser un array de tareas' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TaskOrderDto),
    __metadata("design:type", Array)
], BulkUpdateOrderDto.prototype, "tasks", void 0);
//# sourceMappingURL=bulk-update-order.dto.js.map