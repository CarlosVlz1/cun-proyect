import axiosInstance from '@/lib/axios';
import { tasksService } from '../tasks.service';
import {
  mockTask,
  mockTasksResponse,
  mockCreateTaskData,
  mockUpdateTaskData,
  mockTaskFilters,
} from '../__fixtures__/task.fixture';

// Mock axiosInstance
jest.mock('@/lib/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('tasksService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('debería obtener todas las tareas con filtros', async () => {
      mockedAxiosInstance.get.mockResolvedValue({ data: mockTasksResponse });

      const result = await tasksService.getTasks(mockTaskFilters);

      expect(mockedAxiosInstance.get).toHaveBeenCalledWith('/tasks', {
        params: mockTaskFilters,
      });
      expect(result).toEqual(mockTasksResponse);
    });

    it('debería obtener tareas sin filtros', async () => {
      mockedAxiosInstance.get.mockResolvedValue({ data: mockTasksResponse });

      const result = await tasksService.getTasks();

      expect(mockedAxiosInstance.get).toHaveBeenCalledWith('/tasks', {
        params: undefined,
      });
      expect(result).toEqual(mockTasksResponse);
    });

    it('debería manejar errores al obtener tareas', async () => {
      const error = new Error('Network error');
      mockedAxiosInstance.get.mockRejectedValue(error);

      await expect(tasksService.getTasks()).rejects.toThrow('Network error');
    });
  });

  describe('getTask', () => {
    it('debería obtener una tarea por ID', async () => {
      const taskId = '507f1f77bcf86cd799439021';
      mockedAxiosInstance.get.mockResolvedValue({ data: mockTask });

      const result = await tasksService.getTask(taskId);

      expect(mockedAxiosInstance.get).toHaveBeenCalledWith(`/tasks/${taskId}`);
      expect(result).toEqual(mockTask);
    });
  });

  describe('createTask', () => {
    it('debería crear una nueva tarea', async () => {
      mockedAxiosInstance.post.mockResolvedValue({ data: mockTask });

      const result = await tasksService.createTask(mockCreateTaskData);

      expect(mockedAxiosInstance.post).toHaveBeenCalledWith('/tasks', mockCreateTaskData);
      expect(result).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    it('debería actualizar una tarea', async () => {
      const taskId = '507f1f77bcf86cd799439021';
      const updatedTask = { ...mockTask, ...mockUpdateTaskData };
      mockedAxiosInstance.patch.mockResolvedValue({ data: updatedTask });

      const result = await tasksService.updateTask(taskId, mockUpdateTaskData);

      expect(mockedAxiosInstance.patch).toHaveBeenCalledWith(`/tasks/${taskId}`, mockUpdateTaskData);
      expect(result).toEqual(updatedTask);
    });
  });

  describe('deleteTask', () => {
    it('debería eliminar una tarea', async () => {
      const taskId = '507f1f77bcf86cd799439021';
      mockedAxiosInstance.delete.mockResolvedValue({ data: {} });

      await tasksService.deleteTask(taskId);

      expect(mockedAxiosInstance.delete).toHaveBeenCalledWith(`/tasks/${taskId}`);
    });
  });

  describe('toggleComplete', () => {
    it('debería cambiar el estado de completado de una tarea', async () => {
      const taskId = '507f1f77bcf86cd799439021';
      const toggledTask = { ...mockTask, status: 'completada' as any };
      mockedAxiosInstance.patch.mockResolvedValue({ data: toggledTask });

      const result = await tasksService.toggleComplete(taskId);

      expect(mockedAxiosInstance.patch).toHaveBeenCalledWith(`/tasks/${taskId}/toggle-complete`);
      expect(result).toEqual(toggledTask);
    });
  });

  describe('toggleArchive', () => {
    it('debería archivar/desarchivar una tarea', async () => {
      const taskId = '507f1f77bcf86cd799439021';
      const archivedTask = { ...mockTask, archived: true };
      mockedAxiosInstance.patch.mockResolvedValue({ data: archivedTask });

      const result = await tasksService.toggleArchive(taskId);

      expect(mockedAxiosInstance.patch).toHaveBeenCalledWith(`/tasks/${taskId}/toggle-archive`);
      expect(result).toEqual(archivedTask);
    });
  });

  describe('getUpcoming', () => {
    it('debería obtener tareas próximas a vencer', async () => {
      const days = 7;
      mockedAxiosInstance.get.mockResolvedValue({ data: [mockTask] });

      const result = await tasksService.getUpcoming(days);

      expect(mockedAxiosInstance.get).toHaveBeenCalledWith('/tasks/upcoming', {
        params: { days },
      });
      expect(result).toEqual([mockTask]);
    });

    it('debería usar 7 días por defecto', async () => {
      mockedAxiosInstance.get.mockResolvedValue({ data: [mockTask] });

      await tasksService.getUpcoming();

      expect(mockedAxiosInstance.get).toHaveBeenCalledWith('/tasks/upcoming', {
        params: { days: 7 },
      });
    });
  });

  describe('getOverdue', () => {
    it('debería obtener tareas vencidas', async () => {
      mockedAxiosInstance.get.mockResolvedValue({ data: [mockTask] });

      const result = await tasksService.getOverdue();

      expect(mockedAxiosInstance.get).toHaveBeenCalledWith('/tasks/overdue');
      expect(result).toEqual([mockTask]);
    });
  });

  describe('countByStatus', () => {
    it('debería contar tareas por estado', async () => {
      const counts = { pendiente: 5, en_progreso: 3, completada: 2 };
      mockedAxiosInstance.get.mockResolvedValue({ data: counts });

      const result = await tasksService.countByStatus();

      expect(mockedAxiosInstance.get).toHaveBeenCalledWith('/tasks/count-by-status');
      expect(result).toEqual(counts);
    });
  });

  describe('bulkUpdateOrder', () => {
    it('debería actualizar el orden de múltiples tareas', async () => {
      const tasks = [
        { id: '507f1f77bcf86cd799439021', order: 1 },
        { id: '507f1f77bcf86cd799439022', order: 2 },
      ];
      mockedAxiosInstance.post.mockResolvedValue({ data: {} });

      await tasksService.bulkUpdateOrder(tasks);

      expect(mockedAxiosInstance.post).toHaveBeenCalledWith('/tasks/bulk-update-order', { tasks });
    });
  });

  describe('bulkDelete', () => {
    it('debería eliminar múltiples tareas', async () => {
      const ids = ['507f1f77bcf86cd799439021', '507f1f77bcf86cd799439022'];
      mockedAxiosInstance.post.mockResolvedValue({ data: {} });

      await tasksService.bulkDelete(ids);

      expect(mockedAxiosInstance.post).toHaveBeenCalledWith('/tasks/bulk-delete', { ids });
    });
  });
});

