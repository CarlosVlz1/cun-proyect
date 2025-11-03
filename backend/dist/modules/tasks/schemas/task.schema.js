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
exports.TaskSchema = exports.Task = exports.SubtaskSchema = exports.Subtask = exports.TaskPriority = exports.TaskStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "pendiente";
    TaskStatus["IN_PROGRESS"] = "en_progreso";
    TaskStatus["COMPLETED"] = "completada";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "baja";
    TaskPriority["MEDIUM"] = "media";
    TaskPriority["HIGH"] = "alta";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
let Subtask = class Subtask {
};
exports.Subtask = Subtask;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID único de la subtarea' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, default: () => new mongoose_2.Types.ObjectId() }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Subtask.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Título de la subtarea' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Subtask.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indica si la subtarea está completada' }),
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Subtask.prototype, "completed", void 0);
exports.Subtask = Subtask = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Subtask);
exports.SubtaskSchema = mongoose_1.SchemaFactory.createForClass(Subtask);
let Task = class Task {
};
exports.Task = Task;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Título de la tarea',
        example: 'Completar informe mensual',
    }),
    (0, mongoose_1.Prop)({ required: true, trim: true, minlength: 1, maxlength: 200 }),
    __metadata("design:type", String)
], Task.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción detallada de la tarea',
        example: 'Preparar y enviar el informe de ventas del mes',
        required: false,
    }),
    (0, mongoose_1.Prop)({ default: '', maxlength: 2000 }),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado de la tarea',
        enum: TaskStatus,
        example: TaskStatus.PENDING,
    }),
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(TaskStatus),
        default: TaskStatus.PENDING,
    }),
    __metadata("design:type", String)
], Task.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prioridad de la tarea',
        enum: TaskPriority,
        example: TaskPriority.MEDIUM,
    }),
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(TaskPriority),
        default: TaskPriority.MEDIUM,
    }),
    __metadata("design:type", String)
], Task.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de vencimiento',
        example: '2024-12-31T23:59:59.999Z',
        required: false,
    }),
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Task.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'IDs de categorías asignadas',
        type: [String],
        example: ['507f1f77bcf86cd799439011'],
    }),
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Category' }], default: [] }),
    __metadata("design:type", Array)
], Task.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Etiquetas personalizadas',
        type: [String],
        example: ['urgente', 'revision'],
    }),
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Task.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de subtareas',
        type: [Subtask],
    }),
    (0, mongoose_1.Prop)({ type: [exports.SubtaskSchema], default: [] }),
    __metadata("design:type", Array)
], Task.prototype, "subtasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Orden para drag & drop',
        example: 0,
    }),
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Task.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario propietario',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Task.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si la tarea está archivada',
        example: false,
    }),
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Task.prototype, "archived", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de finalización real',
        required: false,
    }),
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Date)
], Task.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de creación' }),
    __metadata("design:type", Date)
], Task.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de última actualización' }),
    __metadata("design:type", Date)
], Task.prototype, "updatedAt", void 0);
exports.Task = Task = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Task);
exports.TaskSchema = mongoose_1.SchemaFactory.createForClass(Task);
exports.TaskSchema.index({ user: 1, status: 1 });
exports.TaskSchema.index({ user: 1, priority: 1 });
exports.TaskSchema.index({ user: 1, dueDate: 1 });
exports.TaskSchema.index({ user: 1, archived: 1 });
exports.TaskSchema.index({ user: 1, categories: 1 });
exports.TaskSchema.index({ title: 'text', description: 'text', tags: 'text' });
exports.TaskSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        if (this.status === TaskStatus.COMPLETED && !this.completedAt) {
            this.completedAt = new Date();
        }
        else if (this.status !== TaskStatus.COMPLETED) {
            this.completedAt = undefined;
        }
    }
    next();
});
exports.TaskSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
exports.TaskSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
//# sourceMappingURL=task.schema.js.map