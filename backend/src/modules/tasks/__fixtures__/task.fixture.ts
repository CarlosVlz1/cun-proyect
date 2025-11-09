import { Task, TaskStatus, TaskPriority } from '../schemas/task.schema';
import { Types } from 'mongoose';

/**
 * Fixtures para pruebas del módulo de tareas
 */
export const mockTask: Partial<Task> & { _id?: Types.ObjectId; id?: string } = {
  _id: new Types.ObjectId('507f1f77bcf86cd799439021'),
  id: '507f1f77bcf86cd799439021',
  title: 'Test Task',
  description: 'This is a test task',
  status: TaskStatus.PENDING,
  priority: TaskPriority.MEDIUM,
  dueDate: new Date('2024-12-31'),
  tags: ['test', 'important'],
  subtasks: [],
  order: 0,
  user: new Types.ObjectId('507f1f77bcf86cd799439011'),
  archived: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockTaskDocument = {
  ...mockTask,
  toJSON: jest.fn(() => mockTask),
  save: jest.fn().mockResolvedValue(mockTask),
};

export const mockCreateTaskDto = {
  title: 'New Task',
  description: 'New task description',
  status: TaskStatus.PENDING,
  priority: TaskPriority.HIGH,
  dueDate: '2024-12-31T23:59:59.999Z',
  tags: ['urgent'],
};

export const mockUpdateTaskDto = {
  title: 'Updated Task',
  status: TaskStatus.IN_PROGRESS,
};

export const mockFilterTaskDto = {
  status: TaskStatus.PENDING,
  priority: TaskPriority.HIGH,
  search: 'test',
  archived: false,
  sortBy: 'createdAt',
  sortOrder: 'desc' as const,
  page: 1,
  limit: 10,
};

export const mockTaskList = [
  mockTask,
  {
    ...mockTask,
    _id: new Types.ObjectId('507f1f77bcf86cd799439022'),
    id: '507f1f77bcf86cd799439022',
    title: 'Second Task',
    status: TaskStatus.COMPLETED,
  },
  {
    ...mockTask,
    _id: new Types.ObjectId('507f1f77bcf86cd799439023'),
    id: '507f1f77bcf86cd799439023',
    title: 'Third Task',
    status: TaskStatus.IN_PROGRESS,
  },
];

export const mockBulkUpdateOrderDto = {
  tasks: [
    { id: '507f1f77bcf86cd799439021', order: 1 },
    { id: '507f1f77bcf86cd799439022', order: 2 },
    { id: '507f1f77bcf86cd799439023', order: 3 },
  ],
};

