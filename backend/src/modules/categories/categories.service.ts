import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  /**
   * Crea una nueva categoría
   * ISO 25010: Funcionalidad, Mantenibilidad
   */
  async create(userId: string, createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      // Verificar si ya existe una categoría con ese nombre para el usuario
      const existing = await this.categoryModel.findOne({
        user: new Types.ObjectId(userId),
        name: createCategoryDto.name,
      });

      if (existing) {
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }

      const category = new this.categoryModel({
        ...createCategoryDto,
        user: new Types.ObjectId(userId),
      });

      const savedCategory = await category.save();
      this.logger.log(`Categoría creada: ${savedCategory.name} por usuario ${userId}`);

      return savedCategory.toJSON();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error creando categoría: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al crear la categoría');
    }
  }

  /**
   * Obtiene todas las categorías del usuario
   * ISO 25010: Funcionalidad, Eficiencia de Desempeño
   */
  async findAll(userId: string): Promise<Category[]> {
    try {
      const categories = await this.categoryModel
        .find({ user: new Types.ObjectId(userId) })
        .sort({ name: 1 })
        .exec();

      return categories.map((cat) => cat.toJSON());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error obteniendo categorías: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al obtener las categorías');
    }
  }

  /**
   * Obtiene una categoría por ID
   * ISO 25010: Funcionalidad, Fiabilidad
   */
  async findOne(userId: string, id: string): Promise<Category> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de categoría inválido');
    }

    const category = await this.categoryModel.findById(id).exec();

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    // Verificar propiedad
    if (category.user.toString() !== userId) {
      throw new ForbiddenException('No tienes permiso para acceder a esta categoría');
    }

    return category.toJSON();
  }

  /**
   * Actualiza una categoría
   * ISO 25010: Funcionalidad, Mantenibilidad
   */
  async update(
    userId: string,
    id: string,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    // Verificar propiedad primero
    await this.findOne(userId, id);

    try {
      // Si se cambia el nombre, verificar que no exista otra con ese nombre
      if (updateCategoryDto.name) {
        const existing = await this.categoryModel.findOne({
          user: new Types.ObjectId(userId),
          name: updateCategoryDto.name,
          _id: { $ne: new Types.ObjectId(id) },
        });

        if (existing) {
          throw new ConflictException('Ya existe otra categoría con ese nombre');
        }
      }

      const updatedCategory = await this.categoryModel
        .findByIdAndUpdate(id, updateCategoryDto, { new: true })
        .exec();

      if (!updatedCategory) {
        throw new NotFoundException('Categoría no encontrada');
      }

      this.logger.log(`Categoría actualizada: ${updatedCategory.name}`);
      return updatedCategory.toJSON();
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error actualizando categoría: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al actualizar la categoría');
    }
  }

  /**
   * Elimina una categoría
   * ISO 25010: Fiabilidad, Mantenibilidad
   */
  async remove(userId: string, id: string): Promise<void> {
    // Verificar propiedad
    await this.findOne(userId, id);

    const result = await this.categoryModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException('Categoría no encontrada');
    }

    this.logger.log(`Categoría eliminada: ${result.name}`);

    // Nota: Las tareas con esta categoría simplemente quedarán sin ella
    // debido a la referencia ObjectId, no hay cascada automática
  }

  /**
   * Cuenta cuántas tareas tiene cada categoría
   * ISO 25010: Funcionalidad
   */
  async getTaskCounts(userId: string) {
    try {
      const Task = this.categoryModel.db.model('Task');

      const counts = await Task.aggregate([
        {
          $match: {
            user: new Types.ObjectId(userId),
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error contando tareas por categoría: ${errorMessage}`, errorStack);
      return {};
    }
  }
}
