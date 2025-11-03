import { BackupService } from './backup.service';
interface RequestWithUser extends Request {
    user: {
        userId: string;
        username: string;
        email: string;
    };
}
export declare class BackupController {
    private readonly backupService;
    constructor(backupService: BackupService);
    exportData(req: RequestWithUser): Promise<any>;
    importData(req: RequestWithUser, data: any): Promise<{
        imported: number;
        skipped: number;
    }>;
    createBackup(req: RequestWithUser): Promise<any>;
    restoreBackup(req: RequestWithUser, backupData: any): Promise<{
        imported: number;
        skipped: number;
    }>;
    deleteAllData(req: RequestWithUser): Promise<void>;
}
export {};
