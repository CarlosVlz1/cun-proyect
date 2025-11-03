import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/schemas/user.schema';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    validateUser(usernameOrEmail: string, password: string): Promise<any>;
    login(user: any): Promise<{
        accessToken: string;
        tokenType: string;
        expiresIn: string | undefined;
        user: {
            id: any;
            username: any;
            email: any;
            fullName: any;
            avatar: any;
            preferences: any;
        };
    }>;
    register(registerDto: RegisterDto): Promise<User>;
    verifyToken(token: string): Promise<any>;
    refreshToken(userId: string): Promise<{
        accessToken: string;
        tokenType: string;
        expiresIn: string | undefined;
    }>;
}
