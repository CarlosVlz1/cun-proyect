import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
interface RequestWithUser extends Request {
    user: {
        userId: string;
        username: string;
        email: string;
    };
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: RequestWithUser): Promise<import("./schemas/user.schema").User>;
    findAll(page?: number, limit?: number): Promise<{
        users: import("./schemas/user.schema").User[];
        total: number;
        pages: number;
    }>;
    findOne(id: string): Promise<import("./schemas/user.schema").User>;
    updateProfile(req: RequestWithUser, updateUserDto: UpdateUserDto): Promise<import("./schemas/user.schema").User>;
    updatePassword(req: RequestWithUser, updatePasswordDto: UpdatePasswordDto): Promise<void>;
    remove(req: RequestWithUser): Promise<void>;
}
export {};
