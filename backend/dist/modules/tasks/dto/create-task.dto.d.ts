import { TaskStatus, TaskPriority } from '../schemas/task.schema';
export declare class SubtaskDto {
    title: string;
    completed?: boolean;
}
export declare class CreateTaskDto {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    categories?: string[];
    tags?: string[];
    subtasks?: SubtaskDto[];
    order?: number;
}
