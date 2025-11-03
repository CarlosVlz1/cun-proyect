import { Model } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { BulkUpdateOrderDto } from './dto/bulk-update-order.dto';
export declare class TasksService {
    private taskModel;
    private readonly logger;
    constructor(taskModel: Model<TaskDocument>);
    create(userId: string, createTaskDto: CreateTaskDto): Promise<Task>;
    findAll(userId: string, filterDto: FilterTaskDto): Promise<{
        tasks: import("mongoose").FlattenMaps<Task & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
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
    findOne(userId: string, id: string): Promise<Task>;
    update(userId: string, id: string, updateTaskDto: UpdateTaskDto): Promise<Task>;
    bulkUpdateOrder(userId: string, bulkUpdateDto: BulkUpdateOrderDto): Promise<void>;
    toggleComplete(userId: string, id: string): Promise<Task>;
    toggleArchive(userId: string, id: string): Promise<Task>;
    remove(userId: string, id: string): Promise<void>;
    bulkDelete(userId: string, ids: string[]): Promise<void>;
    getUpcoming(userId: string, days?: number): Promise<import("mongoose").FlattenMaps<Task & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>[]>;
    getOverdue(userId: string): Promise<import("mongoose").FlattenMaps<Task & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>[]>;
    countByStatus(userId: string): Promise<Record<TaskStatus, number>>;
}
