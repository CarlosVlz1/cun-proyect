import { TaskStatus, TaskPriority } from '../schemas/task.schema';
export declare class FilterTaskDto {
    status?: TaskStatus;
    priority?: TaskPriority;
    category?: string;
    tag?: string;
    search?: string;
    archived?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
