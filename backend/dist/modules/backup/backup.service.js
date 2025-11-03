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
var BackupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const task_schema_1 = require("../tasks/schemas/task.schema");
const category_schema_1 = require("../categories/schemas/category.schema");
const user_schema_1 = require("../users/schemas/user.schema");
let BackupService = BackupService_1 = class BackupService {
    constructor(taskModel, categoryModel, userModel) {
        this.taskModel = taskModel;
        this.categoryModel = categoryModel;
        this.userModel = userModel;
        this.logger = new common_1.Logger(BackupService_1.name);
        this.EXPORT_VERSION = '1.0.0';
    }
    async exportData(userId) {
        try {
            const userIdObj = new mongoose_2.Types.ObjectId(userId);
            const [user, tasks, categories] = await Promise.all([
                this.userModel.findById(userIdObj).exec(),
                this.taskModel.find({ user: userIdObj }).exec(),
                this.categoryModel.find({ user: userIdObj }).exec(),
            ]);
            if (!user) {
                throw new common_1.BadRequestException('Usuario no encontrado');
            }
            const exportData = {
                version: this.EXPORT_VERSION,
                exportDate: new Date().toISOString(),
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                },
                tasks: tasks.map((task) => task.toJSON()),
                categories: categories.map((cat) => cat.toJSON()),
            };
            this.logger.log(`Datos exportados para usuario ${userId}: ${tasks.length} tareas, ${categories.length} categorías`);
            return exportData;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error exportando datos: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al exportar datos');
        }
    }
    async importData(userId, data) {
        try {
            if (!data.version || !data.tasks || !data.categories) {
                throw new common_1.BadRequestException('Formato de datos inválido');
            }
            const userIdObj = new mongoose_2.Types.ObjectId(userId);
            let importedCount = 0;
            let skippedCount = 0;
            const categoryMapping = new Map();
            for (const catData of data.categories) {
                try {
                    const existing = await this.categoryModel.findOne({
                        user: userIdObj,
                        name: catData.name,
                    });
                    if (existing) {
                        categoryMapping.set(catData.id, existing.id);
                        skippedCount++;
                    }
                    else {
                        const newCategory = new this.categoryModel({
                            name: catData.name,
                            color: catData.color,
                            description: catData.description,
                            icon: catData.icon,
                            user: userIdObj,
                        });
                        const saved = await newCategory.save();
                        categoryMapping.set(catData.id, saved.id);
                        importedCount++;
                    }
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    this.logger.warn(`Error importando categoría ${catData.name}: ${errorMessage}`);
                    skippedCount++;
                }
            }
            for (const taskData of data.tasks) {
                try {
                    const mappedCategories = taskData.categories
                        .map((oldCatId) => categoryMapping.get(oldCatId))
                        .filter((id) => id !== undefined);
                    const newTask = new this.taskModel({
                        title: taskData.title,
                        description: taskData.description,
                        status: taskData.status,
                        priority: taskData.priority,
                        dueDate: taskData.dueDate,
                        categories: mappedCategories,
                        tags: taskData.tags,
                        subtasks: taskData.subtasks,
                        order: taskData.order,
                        user: userIdObj,
                    });
                    await newTask.save();
                    importedCount++;
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    this.logger.warn(`Error importando tarea ${taskData.title}: ${errorMessage}`);
                    skippedCount++;
                }
            }
            this.logger.log(`Importación completada para usuario ${userId}: ${importedCount} importados, ${skippedCount} omitidos`);
            return {
                imported: importedCount,
                skipped: skippedCount,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error importando datos: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al importar datos');
        }
    }
    async createBackup(userId) {
        return this.exportData(userId);
    }
    async restoreBackup(userId, backupData) {
        return this.importData(userId, backupData);
    }
    async deleteAllData(userId) {
        try {
            const userIdObj = new mongoose_2.Types.ObjectId(userId);
            const [tasksDeleted, categoriesDeleted] = await Promise.all([
                this.taskModel.deleteMany({ user: userIdObj }),
                this.categoryModel.deleteMany({ user: userIdObj }),
            ]);
            this.logger.warn(`Todos los datos eliminados para usuario ${userId}: ${tasksDeleted.deletedCount} tareas, ${categoriesDeleted.deletedCount} categorías`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error eliminando todos los datos: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al eliminar todos los datos');
        }
    }
};
exports.BackupService = BackupService;
exports.BackupService = BackupService = BackupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __param(1, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], BackupService);
//# sourceMappingURL=backup.service.js.map