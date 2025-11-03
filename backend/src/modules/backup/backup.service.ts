import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from '../tasks/schemas/task.schema';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

interface ExportData {
  version: string;
  exportDate: string;
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
  };
  tasks: any[];
  categories: any[];
}

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly EXPORT_VERSION = '1.0.0';

  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  /**
   * Exporta todos los datos del usuario
   * ISO 25010: Portabilidad, Funcionalidad
   */
  async exportData(userId: string): Promise<ExportData> {
    try {
      const userIdObj = new Types.ObjectId(userId);

      const [user, tasks, categories] = await Promise.all([
        this.userModel.findById(userIdObj).exec(),
        this.taskModel.find({ user: userIdObj }).exec(),
        this.categoryModel.find({ user: userIdObj }).exec(),
      ]);

      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }

      const exportData: ExportData = {
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

      this.logger.log(
        `Datos exportados para usuario ${userId}: ${tasks.length} tareas, ${categories.length} categorías`
      );

      return exportData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error exportando datos: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al exportar datos');
    }
  }

  /**
   * Importa datos del usuario desde un backup
   * ISO 25010: Portabilidad, Fiabilidad
   */
  async importData(
    userId: string,
    data: ExportData
  ): Promise<{ imported: number; skipped: number }> {
    try {
      // Validar formato de datos
      if (!data.version || !data.tasks || !data.categories) {
        throw new BadRequestException('Formato de datos inválido');
      }

      const userIdObj = new Types.ObjectId(userId);
      let importedCount = 0;
      let skippedCount = 0;

      // Importar categorías primero
      const categoryMapping = new Map<string, string>();

      for (const catData of data.categories) {
        try {
          // Verificar si ya existe una categoría con ese nombre
          const existing = await this.categoryModel.findOne({
            user: userIdObj,
            name: catData.name,
          });

          if (existing) {
            categoryMapping.set(catData.id, existing.id);
            skippedCount++;
          } else {
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
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          this.logger.warn(`Error importando categoría ${catData.name}: ${errorMessage}`);
          skippedCount++;
        }
      }

      // Importar tareas
      for (const taskData of data.tasks) {
        try {
          // Mapear categorías antiguas a nuevas
          const mappedCategories = taskData.categories
            .map((oldCatId: string) => categoryMapping.get(oldCatId))
            .filter((id: string | undefined) => id !== undefined);

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
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          this.logger.warn(`Error importando tarea ${taskData.title}: ${errorMessage}`);
          skippedCount++;
        }
      }

      this.logger.log(
        `Importación completada para usuario ${userId}: ${importedCount} importados, ${skippedCount} omitidos`
      );

      return {
        imported: importedCount,
        skipped: skippedCount,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error importando datos: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al importar datos');
    }
  }

  /**
   * Crea un backup completo del usuario
   * ISO 25010: Fiabilidad
   */
  async createBackup(userId: string): Promise<ExportData> {
    return this.exportData(userId);
  }

  /**
   * Restaura desde un backup
   * ISO 25010: Fiabilidad
   */
  async restoreBackup(
    userId: string,
    backupData: ExportData
  ): Promise<{ imported: number; skipped: number }> {
    return this.importData(userId, backupData);
  }

  /**
   * Elimina todos los datos del usuario (con precaución)
   * ISO 25010: Funcionalidad, Seguridad
   */
  async deleteAllData(userId: string): Promise<void> {
    try {
      const userIdObj = new Types.ObjectId(userId);

      const [tasksDeleted, categoriesDeleted] = await Promise.all([
        this.taskModel.deleteMany({ user: userIdObj }),
        this.categoryModel.deleteMany({ user: userIdObj }),
      ]);

      this.logger.warn(
        `Todos los datos eliminados para usuario ${userId}: ${tasksDeleted.deletedCount} tareas, ${categoriesDeleted.deletedCount} categorías`
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error eliminando todos los datos: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al eliminar todos los datos');
    }
  }
}
