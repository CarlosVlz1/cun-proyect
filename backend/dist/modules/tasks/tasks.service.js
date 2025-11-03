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
var TasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const task_schema_1 = require("./schemas/task.schema");
let TasksService = TasksService_1 = class TasksService {
    constructor(taskModel) {
        this.taskModel = taskModel;
        this.logger = new common_1.Logger(TasksService_1.name);
    }
    async create(userId, createTaskDto) {
        try {
            const taskData = {
                ...createTaskDto,
                user: new mongoose_2.Types.ObjectId(userId),
            };
            if (createTaskDto.categories && Array.isArray(createTaskDto.categories)) {
                taskData.categories = createTaskDto.categories.map((catId) => new mongoose_2.Types.ObjectId(catId));
            }
            const task = new this.taskModel(taskData);
            const savedTask = await task.save();
            const populatedTask = await this.taskModel
                .findById(savedTask._id)
                .populate('categories', 'name color icon description')
                .exec();
            this.logger.log(`Tarea creada: ${savedTask.title} por usuario ${userId}`);
            return populatedTask ? populatedTask.toJSON() : savedTask.toJSON();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error creando tarea: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al crear la tarea');
        }
    }
    async findAll(userId, filterDto) {
        try {
            const { status, priority, category, tag, search, archived = false, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 50, } = filterDto;
            const query = {
                user: new mongoose_2.Types.ObjectId(userId),
                archived,
            };
            if (status)
                query.status = status;
            if (priority)
                query.priority = priority;
            if (category) {
                query.categories = new mongoose_2.Types.ObjectId(category);
            }
            if (tag)
                query.tags = tag;
            if (search) {
                query.$text = { $search: search };
            }
            const skip = (page - 1) * limit;
            const sortOptions = {};
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
            const [tasks, total] = await Promise.all([
                this.taskModel
                    .find(query)
                    .sort(sortOptions)
                    .skip(skip)
                    .limit(limit)
                    .populate('categories', 'name color icon description')
                    .exec(),
                this.taskModel.countDocuments(query),
            ]);
            return {
                tasks: tasks.map((task) => task.toJSON()),
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error obteniendo tareas: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al obtener las tareas');
        }
    }
    async findOne(userId, id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('ID de tarea inválido');
        }
        const task = await this.taskModel
            .findById(id)
            .populate('categories', 'name color icon description')
            .exec();
        if (!task) {
            throw new common_1.NotFoundException('Tarea no encontrada');
        }
        if (task.user.toString() !== userId) {
            throw new common_1.ForbiddenException('No tienes permiso para acceder a esta tarea');
        }
        return task.toJSON();
    }
    async update(userId, id, updateTaskDto) {
        await this.findOne(userId, id);
        try {
            const updateData = { ...updateTaskDto };
            if (updateTaskDto.categories && Array.isArray(updateTaskDto.categories)) {
                updateData.categories = updateTaskDto.categories.map((catId) => new mongoose_2.Types.ObjectId(catId));
            }
            const updatedTask = await this.taskModel
                .findByIdAndUpdate(id, updateData, { new: true })
                .populate('categories', 'name color icon description')
                .exec();
            if (!updatedTask) {
                throw new common_1.NotFoundException('Tarea no encontrada');
            }
            this.logger.log(`Tarea actualizada: ${updatedTask.title}`);
            return updatedTask.toJSON();
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error actualizando tarea: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al actualizar la tarea');
        }
    }
    async bulkUpdateOrder(userId, bulkUpdateDto) {
        try {
            const operations = bulkUpdateDto.tasks.map((task) => ({
                updateOne: {
                    filter: {
                        _id: new mongoose_2.Types.ObjectId(task.id),
                        user: new mongoose_2.Types.ObjectId(userId),
                    },
                    update: { $set: { order: task.order } },
                },
            }));
            await this.taskModel.bulkWrite(operations);
            this.logger.log(`Orden de ${bulkUpdateDto.tasks.length} tareas actualizado`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error actualizando orden: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al actualizar el orden de las tareas');
        }
    }
    async toggleComplete(userId, id) {
        const task = await this.findOne(userId, id);
        const newStatus = task.status === task_schema_1.TaskStatus.COMPLETED ? task_schema_1.TaskStatus.PENDING : task_schema_1.TaskStatus.COMPLETED;
        return this.update(userId, id, { status: newStatus });
    }
    async toggleArchive(userId, id) {
        const task = await this.findOne(userId, id);
        const updateData = { archived: !task.archived };
        return this.update(userId, id, updateData);
    }
    async remove(userId, id) {
        await this.findOne(userId, id);
        const result = await this.taskModel.findByIdAndDelete(id);
        if (!result) {
            throw new common_1.NotFoundException('Tarea no encontrada');
        }
        this.logger.log(`Tarea eliminada: ${result.title}`);
    }
    async bulkDelete(userId, ids) {
        try {
            const result = await this.taskModel.deleteMany({
                _id: { $in: ids.map((id) => new mongoose_2.Types.ObjectId(id)) },
                user: new mongoose_2.Types.ObjectId(userId),
            });
            this.logger.log(`${result.deletedCount} tareas eliminadas`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error eliminando tareas: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al eliminar las tareas');
        }
    }
    async getUpcoming(userId, days = 7) {
        try {
            const now = new Date();
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + days);
            const tasks = await this.taskModel
                .find({
                user: new mongoose_2.Types.ObjectId(userId),
                status: { $ne: task_schema_1.TaskStatus.COMPLETED },
                archived: false,
                dueDate: {
                    $gte: now,
                    $lte: futureDate,
                },
            })
                .sort({ dueDate: 1 })
                .populate('categories', 'name color icon description')
                .exec();
            return tasks.map((task) => task.toJSON());
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error obteniendo tareas próximas: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al obtener tareas próximas');
        }
    }
    async getOverdue(userId) {
        try {
            const now = new Date();
            const tasks = await this.taskModel
                .find({
                user: new mongoose_2.Types.ObjectId(userId),
                status: { $ne: task_schema_1.TaskStatus.COMPLETED },
                archived: false,
                dueDate: {
                    $lt: now,
                },
            })
                .sort({ dueDate: 1 })
                .populate('categories', 'name color icon description')
                .exec();
            return tasks.map((task) => task.toJSON());
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error obteniendo tareas vencidas: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al obtener tareas vencidas');
        }
    }
    async countByStatus(userId) {
        try {
            const counts = await this.taskModel.aggregate([
                {
                    $match: {
                        user: new mongoose_2.Types.ObjectId(userId),
                        archived: false,
                    },
                },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                    },
                },
            ]);
            const result = {
                [task_schema_1.TaskStatus.PENDING]: 0,
                [task_schema_1.TaskStatus.IN_PROGRESS]: 0,
                [task_schema_1.TaskStatus.COMPLETED]: 0,
            };
            counts.forEach((item) => {
                result[item._id] = item.count;
            });
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error contando tareas: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al contar tareas por estado');
        }
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = TasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TasksService);
//# sourceMappingURL=tasks.service.js.map