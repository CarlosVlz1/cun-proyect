import { Model } from 'mongoose';
import { TaskDocument, TaskPriority } from '../tasks/schemas/task.schema';
export declare class StatisticsService {
    private taskModel;
    private readonly logger;
    constructor(taskModel: Model<TaskDocument>);
    getGeneralStats(userId: string): Promise<{
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
        inProgressTasks: number;
        overdueTasks: number;
        tasksThisWeek: number;
        tasksThisMonth: number;
        completionRate: number;
    }>;
    getByPriority(userId: string): Promise<Record<TaskPriority, {
        total: number;
        completed: number;
        pending: number;
        inProgress: number;
    }>>;
    getByCategory(userId: string): Promise<{
        category: any;
        status: any;
        count: any;
    }[]>;
    getWeeklyProductivity(userId: string): Promise<{
        date: any;
        count: any;
    }[]>;
    getMonthlyProductivity(userId: string): Promise<{
        date: any;
        count: any;
    }[]>;
    private getStartOfWeek;
    private getStartOfMonth;
}
