export declare enum UserRole {
    Guest = "guest",
    Host = "host",
    Admin = "admin"
}
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    verificationToken?: string;
    verificationTokenExpires?: Date;
    isVerified?: boolean;
}
