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
exports.CreateTaskDto = exports.SubtaskDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const task_schema_1 = require("../schemas/task.schema");
class SubtaskDto {
}
exports.SubtaskDto = SubtaskDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Título de la subtarea',
        example: 'Revisar documento',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El título de la subtarea es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El título debe ser texto' }),
    (0, class_validator_1.MaxLength)(200, { message: 'El título no puede exceder 200 caracteres' }),
    __metadata("design:type", String)
], SubtaskDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado de la subtarea',
        example: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SubtaskDto.prototype, "completed", void 0);
class CreateTaskDto {
}
exports.CreateTaskDto = CreateTaskDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Título de la tarea',
        example: 'Completar informe mensual',
        maxLength: 200,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El título es requerido' }),
    (0, class_validator_1.IsString)({ message: 'El título debe ser texto' }),
    (0, class_validator_1.MaxLength)(200, { message: 'El título no puede exceder 200 caracteres' }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción detallada de la tarea',
        example: 'Preparar y enviar el informe de ventas del mes',
        required: false,
        maxLength: 2000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La descripción debe ser texto' }),
    (0, class_validator_1.MaxLength)(2000, { message: 'La descripción no puede exceder 2000 caracteres' }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado de la tarea',
        enum: task_schema_1.TaskStatus,
        example: task_schema_1.TaskStatus.PENDING,
        default: task_schema_1.TaskStatus.PENDING,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(task_schema_1.TaskStatus, { message: 'Estado inválido' }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prioridad de la tarea',
        enum: task_schema_1.TaskPriority,
        example: task_schema_1.TaskPriority.MEDIUM,
        default: task_schema_1.TaskPriority.MEDIUM,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(task_schema_1.TaskPriority, { message: 'Prioridad inválida' }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de vencimiento (ISO 8601)',
        example: '2024-12-31T23:59:59.999Z',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Fecha de vencimiento inválida' }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'IDs de categorías asignadas',
        type: [String],
        example: ['507f1f77bcf86cd799439011'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Las categorías deben ser un array' }),
    (0, class_validator_1.IsMongoId)({ each: true, message: 'ID de categoría inválido' }),
    __metadata("design:type", Array)
], CreateTaskDto.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Etiquetas personalizadas',
        type: [String],
        example: ['urgente', 'revision'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Las etiquetas deben ser un array' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada etiqueta debe ser texto' }),
    __metadata("design:type", Array)
], CreateTaskDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de subtareas',
        type: [SubtaskDto],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Las subtareas deben ser un array' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SubtaskDto),
    __metadata("design:type", Array)
], CreateTaskDto.prototype, "subtasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Orden para drag & drop',
        example: 0,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'El orden debe ser un número' }),
    __metadata("design:type", Number)
], CreateTaskDto.prototype, "order", void 0);
//# sourceMappingURL=create-task.dto.js.map