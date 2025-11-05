import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { BulkUpdateOrderDto } from './dto/bulk-update-order.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  /**
   * Crea una nueva tarea
   * ISO 25010: Funcionalidad, Mantenibilidad
   */
  async create(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const taskData: any = {
        ...createTaskDto,
        user: new Types.ObjectId(userId),
      };

      const task = new this.taskModel(taskData);
      const savedTask = await task.save();

      this.logger.log(`Tarea creada: ${savedTask.title} por usuario ${userId}`);

      return savedTask.toJSON();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error creando tarea: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al crear la tarea');
    }
  }

  /**
   * Obtiene todas las tareas del usuario con filtros avanzados
   * ISO 25010: Funcionalidad, Eficiencia de Desempeño
   */
  async findAll(userId: string, filterDto: FilterTaskDto) {
    try {
      const {
        status,
        priority,
        tag,
        search,
        archived = false,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 50,
      } = filterDto;

      // Construir query
      const query: any = {
        user: new Types.ObjectId(userId),
        archived,
      };

      // Filtros
      if (status) query.status = status;
      if (priority) query.priority = priority;
      if (tag) query.tags = tag;

      // Búsqueda full-text
      if (search) {
        query.$text = { $search: search };
      }

      // Paginación
      const skip = (page - 1) * limit;

      // Ordenamiento
      const sortOptions: any = {};
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Ejecutar query
      const [tasks, total] = await Promise.all([
        this.taskModel
          .find(query)
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .exec(),
        this.taskModel.countDocuments(query),
      ]);

      const serializedTasks = tasks.map((task) => task.toJSON());

      return {
        tasks: serializedTasks,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error obteniendo tareas: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al obtener las tareas');
    }
  }

  /**
   * Obtiene una tarea por ID
   * ISO 25010: Funcionalidad, Fiabilidad
   */
  async findOne(userId: string, id: string): Promise<Task> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de tarea inválido');
    }

    const task = await this.taskModel.findById(id).exec();

    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    // Verificar que la tarea pertenece al usuario
    if (task.user.toString() !== userId) {
      throw new ForbiddenException('No tienes permiso para acceder a esta tarea');
    }

    return task.toJSON();
  }

  /**
   * Actualiza una tarea
   * ISO 25010: Funcionalidad, Mantenibilidad
   */
  async update(userId: string, id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    // Verificar propiedad primero
    await this.findOne(userId, id);

    try {
      const updatedTask = await this.taskModel
        .findByIdAndUpdate(id, updateTaskDto, { new: true })
        .exec();

      if (!updatedTask) {
        throw new NotFoundException('Tarea no encontrada');
      }

      this.logger.log(`Tarea actualizada: ${updatedTask.title}`);
      return updatedTask.toJSON();
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error actualizando tarea: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al actualizar la tarea');
    }
  }

  /**
   * Actualiza el orden de múltiples tareas (para drag & drop)
   * ISO 25010: Usabilidad, Eficiencia de Desempeño
   */
  async bulkUpdateOrder(userId: string, bulkUpdateDto: BulkUpdateOrderDto): Promise<void> {
    try {
      const operations = bulkUpdateDto.tasks.map((task) => ({
        updateOne: {
          filter: {
            _id: new Types.ObjectId(task.id),
            user: new Types.ObjectId(userId),
          },
          update: { $set: { order: task.order } },
        },
      }));

      await this.taskModel.bulkWrite(operations);
      this.logger.log(`Orden de ${bulkUpdateDto.tasks.length} tareas actualizado`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error actualizando orden: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al actualizar el orden de las tareas');
    }
  }

  /**
   * Marca/desmarca una tarea como completada
   * ISO 25010: Funcionalidad, Usabilidad
   */
  async toggleComplete(userId: string, id: string): Promise<Task> {
    const task = await this.findOne(userId, id);

    const newStatus =
      task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED;

    return this.update(userId, id, { status: newStatus });
  }

  /**
   * Archiva/desarchivauna tarea
   * ISO 25010: Funcionalidad, Usabilidad
   */
  async toggleArchive(userId: string, id: string): Promise<Task> {
    const task = await this.findOne(userId, id);

    const updateData: any = { archived: !task.archived };
    return this.update(userId, id, updateData);
  }

  /**
   * Elimina una tarea (soft delete)
   * ISO 25010: Fiabilidad, Mantenibilidad
   */
  async remove(userId: string, id: string): Promise<void> {
    // Verificar propiedad
    await this.findOne(userId, id);

    const result = await this.taskModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException('Tarea no encontrada');
    }

    this.logger.log(`Tarea eliminada: ${result.title}`);
  }

  /**
   * Elimina múltiples tareas
   * ISO 25010: Funcionalidad, Eficiencia de Desempeño
   */
  async bulkDelete(userId: string, ids: string[]): Promise<void> {
    try {
      const result = await this.taskModel.deleteMany({
        _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
        user: new Types.ObjectId(userId),
      });

      this.logger.log(`${result.deletedCount} tareas eliminadas`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error eliminando tareas: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al eliminar las tareas');
    }
  }

  /**
   * Obtiene tareas próximas a vencer (para alertas)
   * ISO 25010: Funcionalidad, Usabilidad
   */
  async getUpcoming(userId: string, days = 7) {
    try {
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      const tasks = await this.taskModel
        .find({
          user: new Types.ObjectId(userId),
          status: { $ne: TaskStatus.COMPLETED },
          archived: false,
          dueDate: {
            $gte: now,
            $lte: futureDate,
          },
        })
        .sort({ dueDate: 1 })
        .exec();

      return tasks.map((task) => task.toJSON());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error obteniendo tareas próximas: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al obtener tareas próximas');
    }
  }

  /**
   * Obtiene tareas vencidas
   * ISO 25010: Funcionalidad, Usabilidad
   */
  async getOverdue(userId: string) {
    try {
      const now = new Date();

      const tasks = await this.taskModel
        .find({
          user: new Types.ObjectId(userId),
          status: { $ne: TaskStatus.COMPLETED },
          archived: false,
          dueDate: {
            $lt: now,
          },
        })
        .sort({ dueDate: 1 })
        .exec();

      return tasks.map((task) => task.toJSON());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error obteniendo tareas vencidas: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al obtener tareas vencidas');
    }
  }

  /**
   * Cuenta tareas por estado
   * ISO 25010: Funcionalidad
   */
  async countByStatus(userId: string) {
    try {
      const counts = await this.taskModel.aggregate([
        {
          $match: {
            user: new Types.ObjectId(userId),
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

      const result: Record<TaskStatus, number> = {
        [TaskStatus.PENDING]: 0,
        [TaskStatus.IN_PROGRESS]: 0,
        [TaskStatus.COMPLETED]: 0,
      };

      counts.forEach((item) => {
        result[item._id as TaskStatus] = item.count;
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error contando tareas: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al contar tareas por estado');
    }
  }
}
