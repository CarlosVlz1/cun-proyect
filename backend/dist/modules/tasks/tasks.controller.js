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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tasks_service_1 = require("./tasks.service");
const create_task_dto_1 = require("./dto/create-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const filter_task_dto_1 = require("./dto/filter-task.dto");
const bulk_update_order_dto_1 = require("./dto/bulk-update-order.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    async create(req, createTaskDto) {
        return this.tasksService.create(req.user.userId, createTaskDto);
    }
    async findAll(req, filterDto) {
        return this.tasksService.findAll(req.user.userId, filterDto);
    }
    async getUpcoming(req, days) {
        return this.tasksService.getUpcoming(req.user.userId, days);
    }
    async getOverdue(req) {
        return this.tasksService.getOverdue(req.user.userId);
    }
    async countByStatus(req) {
        return this.tasksService.countByStatus(req.user.userId);
    }
    async findOne(req, id) {
        return this.tasksService.findOne(req.user.userId, id);
    }
    async update(req, id, updateTaskDto) {
        return this.tasksService.update(req.user.userId, id, updateTaskDto);
    }
    async toggleComplete(req, id) {
        return this.tasksService.toggleComplete(req.user.userId, id);
    }
    async toggleArchive(req, id) {
        return this.tasksService.toggleArchive(req.user.userId, id);
    }
    async bulkUpdateOrder(req, bulkUpdateDto) {
        return this.tasksService.bulkUpdateOrder(req.user.userId, bulkUpdateDto);
    }
    async remove(req, id) {
        return this.tasksService.remove(req.user.userId, id);
    }
    async bulkDelete(req, body) {
        return this.tasksService.bulkDelete(req.user.userId, body.ids);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva tarea' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tarea creada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las tareas con filtros' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de tareas obtenida exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, filter_task_dto_1.FilterTaskDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener tareas próximas a vencer' }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, type: Number, example: 7 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tareas próximas obtenidas' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getUpcoming", null);
__decorate([
    (0, common_1.Get)('overdue'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener tareas vencidas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tareas vencidas obtenidas' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getOverdue", null);
__decorate([
    (0, common_1.Get)('count-by-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Contar tareas por estado' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Conteo obtenido exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "countByStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una tarea por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tarea encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tarea no encontrada' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una tarea' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tarea actualizada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tarea no encontrada' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_task_dto_1.UpdateTaskDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar/desmarcar tarea como completada' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado de tarea actualizado' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "toggleComplete", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-archive'),
    (0, swagger_1.ApiOperation)({ summary: 'Archivar/desarchivar tarea' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado de archivo actualizado' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "toggleArchive", null);
__decorate([
    (0, common_1.Post)('bulk-update-order'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar el orden de múltiples tareas (drag & drop)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Orden actualizado exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, bulk_update_order_dto_1.BulkUpdateOrderDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "bulkUpdateOrder", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una tarea' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Tarea eliminada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tarea no encontrada' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('bulk-delete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar múltiples tareas' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Tareas eliminadas exitosamente' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "bulkDelete", null);
exports.TasksController = TasksController = __decorate([
    (0, swagger_1.ApiTags)('tasks'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('tasks'),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map