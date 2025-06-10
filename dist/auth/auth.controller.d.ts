import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private jwtService;
    private readonly authService;
    private userModel;
    private readonly emailService;
    private usersService;
    constructor(jwtService: JwtService, authService: AuthService, userModel: Model<UserDocument>, emailService: EmailService, usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: unknown;
            name: string;
            email: string;
            role: string;
        };
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    resendVerification(email: string): Promise<{
        message: string;
    }>;
    forgotPassword(body: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(body: ResetPasswordDto): Promise<{
        message: string;
    }>;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any): Promise<{
        access_token: string;
        user: {
            id: unknown;
            name: string;
            email: string;
            role: string;
        };
    }>;
}
