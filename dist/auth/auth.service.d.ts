import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly emailService;
    constructor(usersService: UsersService, jwtService: JwtService, emailService: EmailService);
    validateUser(email: string, password: string): Promise<any>;
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
    sendPasswordResetEmail(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
