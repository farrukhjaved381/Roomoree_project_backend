import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export enum UserRole {
  Guest = 'guest',
  Host = 'host',
  Admin = 'admin',
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}