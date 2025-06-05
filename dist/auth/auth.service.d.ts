import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private userModel;
    private readonly emailService;
    constructor(usersService: UsersService, jwtService: JwtService, userModel: Model<UserDocument>, emailService: EmailService);
    validateUser(email: string, password: string): Promise<any>;
    create(createUserDto: CreateUserDto): Promise<User>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: unknown;
            name: string;
            email: string;
            role: import("../users/schemas/user.schema").UserRole;
        };
    }>;
    verifyEmail(email: string, token: string): Promise<{
        message: string;
    }>;
}
