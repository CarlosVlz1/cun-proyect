import { StatisticsService } from './statistics.service';
interface RequestWithUser extends Request {
    user: {
        userId: string;
        username: string;
        email: string;
    };
}
export declare class StatisticsController {
    private readonly statisticsService;
    constructor(statisticsService: StatisticsService);
    getGeneralStats(req: RequestWithUser): Promise<{
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
        inProgressTasks: number;
        overdueTasks: number;
        tasksThisWeek: number;
        tasksThisMonth: number;
        completionRate: number;
    }>;
    getByPriority(req: RequestWithUser): Promise<Record<import("../tasks/schemas/task.schema").TaskPriority, {
        total: number;
        completed: number;
        pending: number;
        inProgress: number;
    }>>;
    getByCategory(req: RequestWithUser): Promise<{
        category: any;
        status: any;
        count: any;
    }[]>;
    getWeeklyProductivity(req: RequestWithUser): Promise<{
        date: any;
        count: any;
    }[]>;
    getMonthlyProductivity(req: RequestWithUser): Promise<{
        date: any;
        count: any;
    }[]>;
}
export {};
