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
var StatisticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const task_schema_1 = require("../tasks/schemas/task.schema");
let StatisticsService = StatisticsService_1 = class StatisticsService {
    constructor(taskModel) {
        this.taskModel = taskModel;
        this.logger = new common_1.Logger(StatisticsService_1.name);
    }
    async getGeneralStats(userId) {
        try {
            const userIdObj = new mongoose_2.Types.ObjectId(userId);
            const [totalTasks, completedTasks, pendingTasks, inProgressTasks, overdueTasks, tasksThisWeek, tasksThisMonth,] = await Promise.all([
                this.taskModel.countDocuments({ user: userIdObj, archived: false }),
                this.taskModel.countDocuments({
                    user: userIdObj,
                    status: task_schema_1.TaskStatus.COMPLETED,
                    archived: false,
                }),
                this.taskModel.countDocuments({
                    user: userIdObj,
                    status: task_schema_1.TaskStatus.PENDING,
                    archived: false,
                }),
                this.taskModel.countDocuments({
                    user: userIdObj,
                    status: task_schema_1.TaskStatus.IN_PROGRESS,
                    archived: false,
                }),
                this.taskModel.countDocuments({
                    user: userIdObj,
                    status: { $ne: task_schema_1.TaskStatus.COMPLETED },
                    archived: false,
                    dueDate: { $lt: new Date() },
                }),
                this.taskModel.countDocuments({
                    user: userIdObj,
                    createdAt: { $gte: this.getStartOfWeek() },
                }),
                this.taskModel.countDocuments({
                    user: userIdObj,
                    createdAt: { $gte: this.getStartOfMonth() },
                }),
            ]);
            const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            return {
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
                overdueTasks,
                tasksThisWeek,
                tasksThisMonth,
                completionRate: Math.round(completionRate * 10) / 10,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error obteniendo estadísticas generales: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al obtener estadísticas');
        }
    }
    async getByPriority(userId) {
        try {
            const stats = await this.taskModel.aggregate([
                {
                    $match: {
                        user: new mongoose_2.Types.ObjectId(userId),
                        archived: false,
                    },
                },
                {
                    $group: {
                        _id: {
                            priority: '$priority',
                            status: '$status',
                        },
                        count: { $sum: 1 },
                    },
                },
            ]);
            const result = {
                [task_schema_1.TaskPriority.HIGH]: { total: 0, completed: 0, pending: 0, inProgress: 0 },
                [task_schema_1.TaskPriority.MEDIUM]: { total: 0, completed: 0, pending: 0, inProgress: 0 },
                [task_schema_1.TaskPriority.LOW]: { total: 0, completed: 0, pending: 0, inProgress: 0 },
            };
            stats.forEach((item) => {
                const priority = item._id.priority;
                const status = item._id.status;
                const count = item.count;
                result[priority].total += count;
                if (status === task_schema_1.TaskStatus.COMPLETED) {
                    result[priority].completed = count;
                }
                else if (status === task_schema_1.TaskStatus.PENDING) {
                    result[priority].pending = count;
                }
                else if (status === task_schema_1.TaskStatus.IN_PROGRESS) {
                    result[priority].inProgress = count;
                }
            });
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error obteniendo estadísticas por prioridad: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al obtener estadísticas por prioridad');
        }
    }
    async getByCategory(userId) {
        try {
            const stats = await this.taskModel.aggregate([
                {
                    $match: {
                        user: new mongoose_2.Types.ObjectId(userId),
                        archived: false,
                    },
                },
                {
                    $unwind: {
                        path: '$categories',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $group: {
                        _id: {
                            category: '$categories',
                            status: '$status',
                        },
                        count: { $sum: 1 },
                    },
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: '_id.category',
                        foreignField: '_id',
                        as: 'categoryInfo',
                    },
                },
            ]);
            return stats.map((item) => ({
                category: item.categoryInfo[0] || null,
                status: item._id.status,
                count: item.count,
            }));
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error obteniendo estadísticas por categoría: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al obtener estadísticas por categoría');
        }
    }
    async getWeeklyProductivity(userId) {
        try {
            const startOfWeek = this.getStartOfWeek();
            const stats = await this.taskModel.aggregate([
                {
                    $match: {
                        user: new mongoose_2.Types.ObjectId(userId),
                        status: task_schema_1.TaskStatus.COMPLETED,
                        completedAt: { $gte: startOfWeek },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: '%Y-%m-%d', date: '$completedAt' },
                        },
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ]);
            return stats.map((item) => ({
                date: item._id,
                count: item.count,
            }));
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error obteniendo productividad semanal: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al obtener productividad semanal');
        }
    }
    async getMonthlyProductivity(userId) {
        try {
            const startOfMonth = this.getStartOfMonth();
            const stats = await this.taskModel.aggregate([
                {
                    $match: {
                        user: new mongoose_2.Types.ObjectId(userId),
                        status: task_schema_1.TaskStatus.COMPLETED,
                        completedAt: { $gte: startOfMonth },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: '%Y-%m-%d', date: '$completedAt' },
                        },
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { _id: 1 },
                },
            ]);
            return stats.map((item) => ({
                date: item._id,
                count: item.count,
            }));
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error obteniendo productividad mensual: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al obtener productividad mensual');
        }
    }
    getStartOfWeek() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(now.setDate(diff));
    }
    getStartOfMonth() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }
};
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = StatisticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], StatisticsService);
//# sourceMappingURL=statistics.service.js.map