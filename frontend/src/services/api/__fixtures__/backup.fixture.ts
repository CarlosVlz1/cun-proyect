import { ExportData, Task, TaskStatus, TaskPriority } from '@/types';

/**
 * Fixtures para pruebas de servicios de backup
 */
export const mockTask: Task = {
  id: '507f1f77bcf86cd799439021',
  title: 'Test Task',
  description: 'Test description',
  status: TaskStatus.PENDING,
  priority: TaskPriority.MEDIUM,
  tags: [],
  subtasks: [],
  order: 0,
  archived: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockExportData: ExportData = {
  version: '1.0.0',
  exportDate: '2024-01-01T00:00:00.000Z',
  user: {
    id: '507f1f77bcf86cd799439011',
    username: 'testuser',
    email: 'test@example.com',
    fullName: 'Test User',
  },
  tasks: [mockTask],
};

export const mockImportResult = {
  imported: 10,
  skipped: 2,
};

