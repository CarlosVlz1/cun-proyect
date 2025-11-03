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
var CategoriesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const category_schema_1 = require("./schemas/category.schema");
let CategoriesService = CategoriesService_1 = class CategoriesService {
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
        this.logger = new common_1.Logger(CategoriesService_1.name);
    }
    async create(userId, createCategoryDto) {
        try {
            const existing = await this.categoryModel.findOne({
                user: new mongoose_2.Types.ObjectId(userId),
                name: createCategoryDto.name,
            });
            if (existing) {
                throw new common_1.ConflictException('Ya existe una categoría con ese nombre');
            }
            const category = new this.categoryModel({
                ...createCategoryDto,
                user: new mongoose_2.Types.ObjectId(userId),
            });
            const savedCategory = await category.save();
            this.logger.log(`Categoría creada: ${savedCategory.name} por usuario ${userId}`);
            return savedCategory.toJSON();
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error creando categoría: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al crear la categoría');
        }
    }
    async findAll(userId) {
        try {
            const categories = await this.categoryModel
                .find({ user: new mongoose_2.Types.ObjectId(userId) })
                .sort({ name: 1 })
                .exec();
            return categories.map((cat) => cat.toJSON());
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error obteniendo categorías: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al obtener las categorías');
        }
    }
    async findOne(userId, id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('ID de categoría inválido');
        }
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new common_1.NotFoundException('Categoría no encontrada');
        }
        if (category.user.toString() !== userId) {
            throw new common_1.ForbiddenException('No tienes permiso para acceder a esta categoría');
        }
        return category.toJSON();
    }
    async update(userId, id, updateCategoryDto) {
        await this.findOne(userId, id);
        try {
            if (updateCategoryDto.name) {
                const existing = await this.categoryModel.findOne({
                    user: new mongoose_2.Types.ObjectId(userId),
                    name: updateCategoryDto.name,
                    _id: { $ne: new mongoose_2.Types.ObjectId(id) },
                });
                if (existing) {
                    throw new common_1.ConflictException('Ya existe otra categoría con ese nombre');
                }
            }
            const updatedCategory = await this.categoryModel
                .findByIdAndUpdate(id, updateCategoryDto, { new: true })
                .exec();
            if (!updatedCategory) {
                throw new common_1.NotFoundException('Categoría no encontrada');
            }
            this.logger.log(`Categoría actualizada: ${updatedCategory.name}`);
            return updatedCategory.toJSON();
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ForbiddenException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error actualizando categoría: ${errorMessage}`, errorStack);
            throw new common_1.BadRequestException('Error al actualizar la categoría');
        }
    }
    async remove(userId, id) {
        await this.findOne(userId, id);
        const result = await this.categoryModel.findByIdAndDelete(id);
        if (!result) {
            throw new common_1.NotFoundException('Categoría no encontrada');
        }
        this.logger.log(`Categoría eliminada: ${result.name}`);
    }
    async getTaskCounts(userId) {
        try {
            const Task = this.categoryModel.db.model('Task');
            const counts = await Task.aggregate([
                {
                    $match: {
                        user: new mongoose_2.Types.ObjectId(userId),
                        archived: false,
                    },
                },
                {
                    $unwind: '$categories',
                },
                {
                    $group: {
                        _id: '$categories',
                        count: { $sum: 1 },
                    },
                },
            ]);
            return counts.reduce((acc, item) => {
                acc[item._id.toString()] = item.count;
                return acc;
            }, {});
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error contando tareas por categoría: ${errorMessage}`, errorStack);
            return {};
        }
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = CategoriesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map