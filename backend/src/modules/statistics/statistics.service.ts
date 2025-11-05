import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument, TaskStatus, TaskPriority } from '../tasks/schemas/task.schema';

@Injectable()
export class StatisticsService {
  private readonly logger = new Logger(StatisticsService.name);

  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  /**
   * Obtiene estadísticas generales del usuario
   * ISO 25010: Funcionalidad, Usabilidad
   */
  async getGeneralStats(userId: string) {
    try {
      const userIdObj = new Types.ObjectId(userId);

      const [
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        overdueTasks,
        tasksThisWeek,
        tasksThisMonth,
      ] = await Promise.all([
        // Total de tareas no archivadas
        this.taskModel.countDocuments({ user: userIdObj, archived: false }),
        // Tareas completadas
        this.taskModel.countDocuments({
          user: userIdObj,
          status: TaskStatus.COMPLETED,
          archived: false,
        }),
        // Tareas pendientes
        this.taskModel.countDocuments({
          user: userIdObj,
          status: TaskStatus.PENDING,
          archived: false,
        }),
        // Tareas en progreso
        this.taskModel.countDocuments({
          user: userIdObj,
          status: TaskStatus.IN_PROGRESS,
          archived: false,
        }),
        // Tareas vencidas
        this.taskModel.countDocuments({
          user: userIdObj,
          status: { $ne: TaskStatus.COMPLETED },
          archived: false,
          dueDate: { $lt: new Date() },
        }),
        // Tareas creadas esta semana
        this.taskModel.countDocuments({
          user: userIdObj,
          createdAt: { $gte: this.getStartOfWeek() },
        }),
        // Tareas creadas este mes
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error obteniendo estadísticas generales: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al obtener estadísticas');
    }
  }

  /**
   * Obtiene estadísticas por prioridad
   * ISO 25010: Funcionalidad
   */
  async getByPriority(userId: string) {
    try {
      const stats = await this.taskModel.aggregate([
        {
          $match: {
            user: new Types.ObjectId(userId),
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

      const result: Record<
        TaskPriority,
        { total: number; completed: number; pending: number; inProgress: number }
      > = {
        [TaskPriority.HIGH]: { total: 0, completed: 0, pending: 0, inProgress: 0 },
        [TaskPriority.MEDIUM]: { total: 0, completed: 0, pending: 0, inProgress: 0 },
        [TaskPriority.LOW]: { total: 0, completed: 0, pending: 0, inProgress: 0 },
      };

      stats.forEach((item) => {
        const priority = item._id.priority as TaskPriority;
        const status = item._id.status;
        const count = item.count;

        result[priority].total += count;

        if (status === TaskStatus.COMPLETED) {
          result[priority].completed = count;
        } else if (status === TaskStatus.PENDING) {
          result[priority].pending = count;
        } else if (status === TaskStatus.IN_PROGRESS) {
          result[priority].inProgress = count;
        }
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error obteniendo estadísticas por prioridad: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al obtener estadísticas por prioridad');
    }
  }

  /**
   * Obtiene estadísticas por categoría
   * ISO 25010: Funcionalidad
   */

  /**
   * Obtiene productividad semanal (tareas completadas por día)
   * ISO 25010: Funcionalidad, Usabilidad
   */
  async getWeeklyProductivity(userId: string) {
    try {
      const startOfWeek = this.getStartOfWeek();

      const stats = await this.taskModel.aggregate([
        {
          $match: {
            user: new Types.ObjectId(userId),
            status: TaskStatus.COMPLETED,
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error obteniendo productividad semanal: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al obtener productividad semanal');
    }
  }

  /**
   * Obtiene productividad mensual (tareas completadas por día)
   * ISO 25010: Funcionalidad, Usabilidad
   */
  async getMonthlyProductivity(userId: string) {
    try {
      const startOfMonth = this.getStartOfMonth();

      const stats = await this.taskModel.aggregate([
        {
          $match: {
            user: new Types.ObjectId(userId),
            status: TaskStatus.COMPLETED,
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error obteniendo productividad mensual: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al obtener productividad mensual');
    }
  }

  /**
   * Obtiene el inicio de la semana actual (lunes)
   */
  private getStartOfWeek(): Date {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Ajustar cuando es domingo
    return new Date(now.setDate(diff));
  }

  /**
   * Obtiene el inicio del mes actual
   */
  private getStartOfMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}
