import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
interface RequestWithUser extends Request {
    user: {
        userId?: string;
        _id?: string;
        id?: string;
        username: string;
        email: string;
        fullName?: string;
        avatar?: string;
        preferences?: any;
    };
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: any;
            username: string;
            email: string;
            fullName: string;
        };
    }>;
    login(req: RequestWithUser): Promise<{
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
    refreshToken(req: RequestWithUser): Promise<{
        accessToken: string;
        tokenType: string;
        expiresIn: string | undefined;
    }>;
    logout(): Promise<void>;
    verify(req: RequestWithUser): Promise<any>;
}
export {};
