import axiosInstance from '@/lib/axios';
import {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
  TasksResponse,
} from '@/types';

/**
 * Servicio de tareas
 * ISO 25010: Funcionalidad, Eficiencia de Desempeño
 */

export const tasksService = {
  /**
   * Obtiene todas las tareas con filtros
   */
  async getTasks(filters?: TaskFilters): Promise<TasksResponse> {
    try {
      const response = await axiosInstance.get<TasksResponse>('/tasks', {
        params: filters,
      });
      console.log('TasksService - Raw axios response:', response);
      console.log('TasksService - response.data:', response.data);
      console.log('TasksService - response.data.tasks:', response.data?.tasks);
      return response.data;
    } catch (error) {
      console.error('TasksService - Error in getTasks:', error);
      throw error;
    }
  },

  /**
   * Obtiene una tarea por ID
   */
  async getTask(id: string): Promise<Task> {
    const response = await axiosInstance.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Crea una nueva tarea
   */
  async createTask(data: CreateTaskData): Promise<Task> {
    const response = await axiosInstance.post<Task>('/tasks', data);
    return response.data;
  },

  /**
   * Actualiza una tarea
   */
  async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    const response = await axiosInstance.patch<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  /**
   * Elimina una tarea
   */
  async deleteTask(id: string): Promise<void> {
    await axiosInstance.delete(`/tasks/${id}`);
  },

  /**
   * Marca/desmarca una tarea como completada
   */
  async toggleComplete(id: string): Promise<Task> {
    const response = await axiosInstance.patch<Task>(`/tasks/${id}/toggle-complete`);
    return response.data;
  },

  /**
   * Archiva/desarchivauna tarea
   */
  async toggleArchive(id: string): Promise<Task> {
    const response = await axiosInstance.patch<Task>(`/tasks/${id}/toggle-archive`);
    return response.data;
  },

  /**
   * Obtiene tareas próximas a vencer
   */
  async getUpcoming(days = 7): Promise<Task[]> {
    const response = await axiosInstance.get<Task[]>('/tasks/upcoming', {
      params: { days },
    });
    return response.data;
  },

  /**
   * Obtiene tareas vencidas
   */
  async getOverdue(): Promise<Task[]> {
    const response = await axiosInstance.get<Task[]>('/tasks/overdue');
    return response.data;
  },

  /**
   * Cuenta tareas por estado
   */
  async countByStatus(): Promise<Record<string, number>> {
    const response = await axiosInstance.get<Record<string, number>>('/tasks/count-by-status');
    return response.data;
  },

  /**
   * Actualiza el orden de múltiples tareas
   */
  async bulkUpdateOrder(tasks: { id: string; order: number }[]): Promise<void> {
    await axiosInstance.post('/tasks/bulk-update-order', { tasks });
  },

  /**
   * Elimina múltiples tareas
   */
  async bulkDelete(ids: string[]): Promise<void> {
    await axiosInstance.post('/tasks/bulk-delete', { ids });
  },
};

