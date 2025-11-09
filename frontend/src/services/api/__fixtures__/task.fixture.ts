import { Task, TaskStatus, TaskPriority, TasksResponse } from '@/types';

/**
 * Fixtures para pruebas de servicios de tareas
 */
export const mockTask: Task = {
  id: '507f1f77bcf86cd799439021',
  title: 'Test Task',
  description: 'This is a test task',
  status: TaskStatus.PENDING,
  priority: TaskPriority.MEDIUM,
  dueDate: '2024-12-31T23:59:59.999Z',
  tags: ['test', 'important'],
  subtasks: [],
  order: 0,
  archived: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockTasksResponse: TasksResponse = {
  tasks: [
    mockTask,
    {
      ...mockTask,
      id: '507f1f77bcf86cd799439022',
      title: 'Second Task',
      status: TaskStatus.COMPLETED,
    },
  ],
  pagination: {
    total: 2,
    page: 1,
    limit: 10,
    pages: 1,
  },
};

export const mockCreateTaskData = {
  title: 'New Task',
  description: 'New task description',
  status: TaskStatus.PENDING,
  priority: TaskPriority.HIGH,
  dueDate: '2024-12-31T23:59:59.999Z',
  tags: ['urgent'],
};

export const mockUpdateTaskData = {
  title: 'Updated Task',
  status: TaskStatus.IN_PROGRESS,
};

export const mockTaskFilters = {
  status: TaskStatus.PENDING,
  priority: TaskPriority.HIGH,
  search: 'test',
  archived: false,
  sortBy: 'createdAt',
  sortOrder: 'desc' as const,
  page: 1,
  limit: 10,
};

