import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { TasksService } from '../tasks.service';
import { Task, TaskDocument, TaskStatus } from '../schemas/task.schema';
import {
  mockTask,
  mockTaskDocument,
  mockCreateTaskDto,
  mockUpdateTaskDto,
  mockFilterTaskDto,
  mockTaskList,
  mockBulkUpdateOrderDto,
} from '../__fixtures__/task.fixture';

describe('TasksService', () => {
  let service: TasksService;
  let model: jest.Mocked<Model<TaskDocument>>;
  const userId = '507f1f77bcf86cd799439011';

  beforeEach(async () => {
    // Crear una función constructora mockeada
    const MockTaskModelConstructor = jest.fn();
    
    const mockModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      deleteMany: jest.fn(),
      countDocuments: jest.fn(),
      aggregate: jest.fn(),
      bulkWrite: jest.fn(),
    };

    // Hacer que el mockModel sea también un constructor
    Object.setPrototypeOf(mockModel, MockTaskModelConstructor);
    (mockModel as any).constructor = MockTaskModelConstructor;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    model = module.get(getModelToken(Task.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería crear una nueva tarea', async () => {
      const taskInstance = {
        ...mockTaskDocument,
        save: jest.fn().mockResolvedValue(mockTaskDocument),
      };

      // Mock del constructor del modelo usando el taskModel del servicio
      const MockTaskModel = jest.fn().mockImplementation(() => taskInstance);
      (service as any).taskModel = MockTaskModel;

      const result = await service.create(userId, mockCreateTaskDto);

      expect(MockTaskModel).toHaveBeenCalled();
      expect(taskInstance.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('debería lanzar BadRequestException si hay un error al crear', async () => {
      const MockTaskModel = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });
      (service as any).taskModel = MockTaskModel;

      await expect(service.create(userId, mockCreateTaskDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería manejar errores genéricos al crear', async () => {
      const taskInstance = {
        ...mockTaskDocument,
        save: jest.fn().mockRejectedValue(new Error('Save failed')),
      };

      const MockTaskModel = jest.fn().mockImplementation(() => taskInstance);
      (service as any).taskModel = MockTaskModel;

      await expect(service.create(userId, mockCreateTaskDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('debería retornar lista paginada de tareas con filtros', async () => {
      const total = 2;
      const query = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockTaskList.map(task => ({
          ...task,
          toJSON: jest.fn(() => task),
        }))),
      };

      model.find = jest.fn().mockReturnValue(query);
      model.countDocuments = jest.fn().mockResolvedValue(total);

      const result = await service.findAll(userId, mockFilterTaskDto);

      expect(model.find).toHaveBeenCalled();
      expect(result.tasks).toBeDefined();
      expect(result.pagination).toEqual({
        total,
        page: mockFilterTaskDto.page,
        limit: mockFilterTaskDto.limit,
        pages: Math.ceil(total / mockFilterTaskDto.limit),
      });
    });

    it('debería aplicar filtro por tag', async () => {
      const total = 1;
      const filterWithTag = { ...mockFilterTaskDto, tag: 'test' };
      const query = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockTaskList[0]].map(task => ({
          ...task,
          toJSON: jest.fn(() => task),
        }))),
      };

      model.find = jest.fn().mockReturnValue(query);
      model.countDocuments = jest.fn().mockResolvedValue(total);

      await service.findAll(userId, filterWithTag);

      expect(model.find).toHaveBeenCalledWith(
        expect.objectContaining({ tags: 'test' })
      );
    });

    it('debería aplicar búsqueda full-text cuando se proporciona search', async () => {
      const total = 1;
      const filterWithSearch = { ...mockFilterTaskDto, search: 'test task' };
      const query = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockTaskList[0]].map(task => ({
          ...task,
          toJSON: jest.fn(() => task),
        }))),
      };

      model.find = jest.fn().mockReturnValue(query);
      model.countDocuments = jest.fn().mockResolvedValue(total);

      await service.findAll(userId, filterWithSearch);

      expect(model.find).toHaveBeenCalledWith(
        expect.objectContaining({ $text: { $search: 'test task' } })
      );
    });

    it('debería usar valores por defecto cuando no se proporcionan', async () => {
      const total = 0;
      const emptyFilter = {};
      const query = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };

      model.find = jest.fn().mockReturnValue(query);
      model.countDocuments = jest.fn().mockResolvedValue(total);

      const result = await service.findAll(userId, emptyFilter as any);

      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(50);
    });

    it('debería aplicar ordenamiento ascendente cuando se especifica', async () => {
      const total = 1;
      const filterAsc = { ...mockFilterTaskDto, sortOrder: 'asc' as const };
      const query = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockTaskList[0]].map(task => ({
          ...task,
          toJSON: jest.fn(() => task),
        }))),
      };

      model.find = jest.fn().mockReturnValue(query);
      model.countDocuments = jest.fn().mockResolvedValue(total);

      await service.findAll(userId, filterAsc);

      expect(query.sort).toHaveBeenCalled();
    });

    it('debería manejar errores y lanzar BadRequestException', async () => {
      model.find = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(service.findAll(userId, mockFilterTaskDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('debería encontrar una tarea por ID', async () => {
      const taskId = '507f1f77bcf86cd799439021';
      const taskWithUser = {
        ...mockTaskDocument,
        user: { toString: () => userId },
      };

      model.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(taskWithUser),
      });

      const result = await service.findOne(userId, taskId);

      expect(model.findById).toHaveBeenCalledWith(taskId);
      expect(result).toBeDefined();
    });

    it('debería lanzar BadRequestException si el ID es inválido', async () => {
      const invalidId = 'invalid-id';

      await expect(service.findOne(userId, invalidId)).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar NotFoundException si la tarea no existe', async () => {
      const taskId = '507f1f77bcf86cd799439021';

      model.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne(userId, taskId)).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar ForbiddenException si la tarea no pertenece al usuario', async () => {
      const taskId = '507f1f77bcf86cd799439021';
      const otherUserId = '507f1f77bcf86cd799439099';
      const taskWithOtherUser = {
        ...mockTaskDocument,
        user: { toString: () => otherUserId },
      };

      model.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(taskWithOtherUser),
      });

      await expect(service.findOne(userId, taskId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('debería actualizar una tarea', async () => {
      const taskId = '507f1f77bcf86cd799439021';
      const updatedTask = { ...mockTask, ...mockUpdateTaskDto };

      // Mock findOne para verificar propiedad
      const taskWithUser = {
        ...mockTaskDocument,
        user: { toString: () => userId },
        toJSON: jest.fn(() => mockTask),
      };
      model.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(taskWithUser),
      });

      // Mock update
      const updatedTaskWithJSON = {
        ...updatedTask,
        toJSON: jest.fn(() => updatedTask),
      };
      model.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedTaskWithJSON),
      });

      const result = await service.update(userId, taskId, mockUpdateTaskDto);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        taskId,
        mockUpdateTaskDto,
        { new: true },
      );
      expect(result).toBeDefined();
    });

    it('debería lanzar NotFoundException si la tarea no existe al actualizar', async () => {
      const taskId = '507f1f77bcf86cd799439021';

      const taskWithUser = {
        ...mockTaskDocument,
        user: { toString: () => userId },
        toJSON: jest.fn(() => mockTask),
      };
      model.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(taskWithUser),
      });

      model.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update(userId, taskId, mockUpdateTaskDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('debería lanzar BadRequestException si hay un error al actualizar', async () => {
      const taskId = '507f1f77bcf86cd799439021';

      const taskWithUser = {
        ...mockTaskDocument,
        user: { toString: () => userId },
        toJSON: jest.fn(() => mockTask),
      };
      model.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(taskWithUser),
      });

      model.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(service.update(userId, taskId, mockUpdateTaskDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('toggleComplete', () => {
    it('debería cambiar el estado de PENDING a COMPLETED', async () => {
      const taskId = '507f1f77bcf86cd799439021';
      const pendingTask = {
        ...mockTaskDocument,
        status: TaskStatus.PENDING,
        user: { toString: () => userId },
      };
      const completedTask = { ...pendingTask, status: TaskStatus.COMPLETED };

      model.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(pendingTask),
      });

      const updateSpy = jest.spyOn(service, 'update').mockResolvedValue(completedTask as any);

      const result = await service.toggleComplete(userId, taskId);

      expect(updateSpy).toHaveBeenCalledWith(userId, taskId, {
        status: TaskStatus.COMPLETED,
      });
      expect(result.status).toBe(TaskStatus.COMPLETED);
      updateSpy.mockRestore();
    });

    it('debería cambiar el estado de COMPLETED a PENDING', async () => {
      const taskId = '507f1f77bcf86cd799439021';
      const completedTask = {
        ...mockTaskDocument,
        status: TaskStatus.COMPLETED,
        user: { toString: () => userId },
        toJSON: jest.fn(() => ({ ...mockTaskDocument, status: TaskStatus.COMPLETED })),
      };
      const pendingTask = { ...completedTask, status: TaskStatus.PENDING };

      model.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(completedTask),
      });

      const updateSpy = jest.spyOn(service, 'update').mockResolvedValue(pendingTask as any);

      const result = await service.toggleComplete(userId, taskId);

      expect(updateSpy).toHaveBeenCalledWith(userId, taskId, {
        status: TaskStatus.PENDING,
      });
      expect(result.status).toBe(TaskStatus.PENDING);
      updateSpy.mockRestore();
    });
  });

  describe('toggleArchive', () => {
    it('debería archivar una tarea', async () => {
      const taskId = '507f1f77bcf86cd799439021';
      const unarchivedTask = {
        ...mockTaskDocument,
        archived: false,
        user: { toString: () => userId },
      };
      const archivedTask = { ...unarchivedTask, archived: true };

      model.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(unarchivedTask),
      });

      jest.spyOn(service, 'update').mockResolvedValue(archivedTask as any);

      const result = await service.toggleArchive(userId, taskId);

      expect(service.update).toHaveBeenCalledWith(userId, taskId, { archived: true });
      expect(result.archived).toBe(true);
    });
  });

  describe('remove', () => {
    it('debería eliminar una tarea', async () => {
      const taskId = '507f1f77bcf86cd799439021';
      const taskWithUser = {
        ...mockTaskDocument,
        user: { toString: () => userId },
      };

      model.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(taskWithUser),
      });
      model.findByIdAndDelete = jest.fn().mockResolvedValue(mockTask);

      await service.remove(userId, taskId);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(taskId);
    });

    it('debería lanzar NotFoundException si la tarea no existe', async () => {
      const taskId = '507f1f77bcf86cd799439021';
      const taskWithUser = {
        ...mockTaskDocument,
        user: { toString: () => userId },
      };

      model.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(taskWithUser),
      });
      model.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await expect(service.remove(userId, taskId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('bulkDelete', () => {
    it('debería eliminar múltiples tareas', async () => {
      const taskIds = ['507f1f77bcf86cd799439021', '507f1f77bcf86cd799439022'];

      model.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 2 });

      await service.bulkDelete(userId, taskIds);

      expect(model.deleteMany).toHaveBeenCalledWith({
        _id: { $in: taskIds.map((id) => new Types.ObjectId(id)) },
        user: new Types.ObjectId(userId),
      });
    });

    it('debería manejar errores y lanzar BadRequestException', async () => {
      const taskIds = ['507f1f77bcf86cd799439021'];

      model.deleteMany = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(service.bulkDelete(userId, taskIds)).rejects.toThrow(BadRequestException);
    });
  });

  describe('bulkUpdateOrder', () => {
    it('debería actualizar el orden de múltiples tareas', async () => {
      model.bulkWrite = jest.fn().mockResolvedValue({});

      await service.bulkUpdateOrder(userId, mockBulkUpdateOrderDto);

      expect(model.bulkWrite).toHaveBeenCalled();
    });

    it('debería manejar errores y lanzar BadRequestException', async () => {
      model.bulkWrite = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(service.bulkUpdateOrder(userId, mockBulkUpdateOrderDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getUpcoming', () => {
    it('debería obtener tareas próximas a vencer', async () => {
      const days = 7;
      const upcomingTasks = [
        {
          ...mockTaskDocument,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 días desde ahora
          toJSON: jest.fn(() => mockTask),
        },
      ];

      const query = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(upcomingTasks),
      };

      model.find = jest.fn().mockReturnValue(query);

      const result = await service.getUpcoming(userId, days);

      expect(model.find).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('debería usar 7 días por defecto si no se especifica', async () => {
      const upcomingTasks = [
        {
          ...mockTaskDocument,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          toJSON: jest.fn(() => mockTask),
        },
      ];

      const query = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(upcomingTasks),
      };

      model.find = jest.fn().mockReturnValue(query);

      const result = await service.getUpcoming(userId);

      expect(result).toBeDefined();
    });

    it('debería manejar errores y lanzar BadRequestException', async () => {
      model.find = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(service.getUpcoming(userId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getOverdue', () => {
    it('debería obtener tareas vencidas', async () => {
      const overdueTasks = [
        {
          ...mockTaskDocument,
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
          toJSON: jest.fn(() => mockTask),
        },
      ];

      const query = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(overdueTasks),
      };

      model.find = jest.fn().mockReturnValue(query);

      const result = await service.getOverdue(userId);

      expect(model.find).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('debería manejar errores y lanzar BadRequestException', async () => {
      model.find = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(service.getOverdue(userId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('countByStatus', () => {
    it('debería contar tareas por estado', async () => {
      const mockAggregateResult = [
        { _id: TaskStatus.PENDING, count: 5 },
        { _id: TaskStatus.IN_PROGRESS, count: 3 },
        { _id: TaskStatus.COMPLETED, count: 2 },
      ];

      model.aggregate = jest.fn().mockResolvedValue(mockAggregateResult);

      const result = await service.countByStatus(userId);

      expect(result).toEqual({
        [TaskStatus.PENDING]: 5,
        [TaskStatus.IN_PROGRESS]: 3,
        [TaskStatus.COMPLETED]: 2,
      });
    });

    it('debería retornar ceros si no hay tareas', async () => {
      model.aggregate = jest.fn().mockResolvedValue([]);

      const result = await service.countByStatus(userId);

      expect(result).toEqual({
        [TaskStatus.PENDING]: 0,
        [TaskStatus.IN_PROGRESS]: 0,
        [TaskStatus.COMPLETED]: 0,
      });
    });

    it('debería manejar errores y lanzar BadRequestException', async () => {
      model.aggregate = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(service.countByStatus(userId)).rejects.toThrow(BadRequestException);
    });
  });
});

