import { Model } from 'mongoose';
import { TaskDocument } from '../tasks/schemas/task.schema';
import { CategoryDocument } from '../categories/schemas/category.schema';
import { UserDocument } from '../users/schemas/user.schema';
interface ExportData {
    version: string;
    exportDate: string;
    user: {
        id: string;
        username: string;
        email: string;
        fullName: string;
    };
    tasks: any[];
    categories: any[];
}
export declare class BackupService {
    private taskModel;
    private categoryModel;
    private userModel;
    private readonly logger;
    private readonly EXPORT_VERSION;
    constructor(taskModel: Model<TaskDocument>, categoryModel: Model<CategoryDocument>, userModel: Model<UserDocument>);
    exportData(userId: string): Promise<ExportData>;
    importData(userId: string, data: ExportData): Promise<{
        imported: number;
        skipped: number;
    }>;
    createBackup(userId: string): Promise<ExportData>;
    restoreBackup(userId: string, backupData: ExportData): Promise<{
        imported: number;
        skipped: number;
    }>;
    deleteAllData(userId: string): Promise<void>;
}
export {};
