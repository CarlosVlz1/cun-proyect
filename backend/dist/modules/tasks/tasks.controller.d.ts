import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { BulkUpdateOrderDto } from './dto/bulk-update-order.dto';
interface RequestWithUser extends Request {
    user: {
        userId: string;
        username: string;
        email: string;
    };
}
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(req: RequestWithUser, createTaskDto: CreateTaskDto): Promise<import("./schemas/task.schema").Task>;
    findAll(req: RequestWithUser, filterDto: FilterTaskDto): Promise<{
        tasks: import("mongoose").FlattenMaps<import("./schemas/task.schema").Task & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }>[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    getUpcoming(req: RequestWithUser, days?: number): Promise<import("mongoose").FlattenMaps<import("./schemas/task.schema").Task & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>[]>;
    getOverdue(req: RequestWithUser): Promise<import("mongoose").FlattenMaps<import("./schemas/task.schema").Task & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>[]>;
    countByStatus(req: RequestWithUser): Promise<Record<import("./schemas/task.schema").TaskStatus, number>>;
    findOne(req: RequestWithUser, id: string): Promise<import("./schemas/task.schema").Task>;
    update(req: RequestWithUser, id: string, updateTaskDto: UpdateTaskDto): Promise<import("./schemas/task.schema").Task>;
    toggleComplete(req: RequestWithUser, id: string): Promise<import("./schemas/task.schema").Task>;
    toggleArchive(req: RequestWithUser, id: string): Promise<import("./schemas/task.schema").Task>;
    bulkUpdateOrder(req: RequestWithUser, bulkUpdateDto: BulkUpdateOrderDto): Promise<void>;
    remove(req: RequestWithUser, id: string): Promise<void>;
    bulkDelete(req: RequestWithUser, body: {
        ids: string[];
    }): Promise<void>;
}
export {};
