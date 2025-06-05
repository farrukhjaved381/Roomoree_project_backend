import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { EmailService } from '../email/email.service';
export declare class AuthController {
    private readonly authService;
    private userModel;
    private readonly emailService;
    constructor(authService: AuthService, userModel: Model<UserDocument>, emailService: EmailService);
    register(createUserDto: CreateUserDto): Promise<User>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: unknown;
            name: string;
            email: string;
            role: import("../users/schemas/user.schema").UserRole;
        };
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    resendVerification(email: string): Promise<{
        message: string;
    }>;
}
