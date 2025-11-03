import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
export declare class UsersService {
    private userModel;
    private readonly logger;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findByUsername(username: string): Promise<UserDocument | null>;
    findById(id: string): Promise<User>;
    findAll(page?: number, limit?: number): Promise<{
        users: User[];
        total: number;
        pages: number;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<void>;
    updateLastLogin(id: string): Promise<void>;
    remove(id: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
}
