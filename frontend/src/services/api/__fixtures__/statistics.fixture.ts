import { GeneralStats, PriorityStats, ProductivityData, TaskPriority } from '@/types';

/**
 * Fixtures para pruebas de servicios de estadísticas
 */
export const mockGeneralStats: GeneralStats = {
  totalTasks: 100,
  completedTasks: 60,
  pendingTasks: 25,
  inProgressTasks: 15,
  overdueTasks: 5,
  tasksThisWeek: 20,
  tasksThisMonth: 50,
  completionRate: 60,
};

export const mockPriorityStats: PriorityStats = {
  [TaskPriority.HIGH]: {
    total: 30,
    completed: 20,
    pending: 5,
    inProgress: 5,
  },
  [TaskPriority.MEDIUM]: {
    total: 50,
    completed: 30,
    pending: 15,
    inProgress: 5,
  },
  [TaskPriority.LOW]: {
    total: 20,
    completed: 10,
    pending: 5,
    inProgress: 5,
  },
};

export const mockProductivityData: ProductivityData[] = [
  { date: '2024-01-01', count: 5 },
  { date: '2024-01-02', count: 8 },
  { date: '2024-01-03', count: 12 },
  { date: '2024-01-04', count: 10 },
  { date: '2024-01-05', count: 15 },
  { date: '2024-01-06', count: 7 },
  { date: '2024-01-07', count: 9 },
];

