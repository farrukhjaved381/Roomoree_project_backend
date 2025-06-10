import { UserRole } from '../../users/schemas/user.schema';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    isVerified?: boolean;
    verificationToken?: string;
    verificationTokenExpires?: Date;
}
