/**
 * Tipos y interfaces del frontend
 * ISO 25010: Mantenibilidad, Funcionalidad
 */

// Usuario
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  preferences: UserPreferences;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'es' | 'en';
  notifications: boolean;
  dateFormat: string;
}

// Autenticación
export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  avatar?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: User;
}

// Tarea
export enum TaskStatus {
  PENDING = 'pendiente',
  IN_PROGRESS = 'en_progreso',
  COMPLETED = 'completada',
}

export enum TaskPriority {
  LOW = 'baja',
  MEDIUM = 'media',
  HIGH = 'alta',
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  tags: string[];
  subtasks: Subtask[];
  order: number;
  archived: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
  subtasks?: Subtask[];
  order?: number;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  tag?: string;
  search?: string;
  archived?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Estadísticas
export interface GeneralStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  tasksThisWeek: number;
  tasksThisMonth: number;
  completionRate: number;
}

export interface PriorityStats {
  [TaskPriority.HIGH]: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
  };
  [TaskPriority.MEDIUM]: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
  };
  [TaskPriority.LOW]: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
  };
}

export interface ProductivityData {
  date: string;
  count: number;
}

// Backup/Export
export interface ExportData {
  version: string;
  exportDate: string;
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
  };
  tasks: Task[];
}

export interface ImportResult {
  imported: number;
  skipped: number;
}

// API Response
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// UI State
export interface UIState {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  theme: 'light' | 'dark' | 'system';
}

