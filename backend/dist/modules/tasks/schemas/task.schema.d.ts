import { Document, Types } from 'mongoose';
export type TaskDocument = Task & Document;
export declare enum TaskStatus {
    PENDING = "pendiente",
    IN_PROGRESS = "en_progreso",
    COMPLETED = "completada"
}
export declare enum TaskPriority {
    LOW = "baja",
    MEDIUM = "media",
    HIGH = "alta"
}
export declare class Subtask {
    id: Types.ObjectId;
    title: string;
    completed: boolean;
}
export declare const SubtaskSchema: import("mongoose").Schema<Subtask, import("mongoose").Model<Subtask, any, any, any, Document<unknown, any, Subtask, any, {}> & Subtask & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Subtask, Document<unknown, {}, import("mongoose").FlatRecord<Subtask>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Subtask> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Task {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: Date;
    categories: Types.ObjectId[];
    tags: string[];
    subtasks: Subtask[];
    order: number;
    user: Types.ObjectId;
    archived: boolean;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const TaskSchema: import("mongoose").Schema<Task, import("mongoose").Model<Task, any, any, any, Document<unknown, any, Task, any, {}> & Task & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Task, Document<unknown, {}, import("mongoose").FlatRecord<Task>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Task> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
