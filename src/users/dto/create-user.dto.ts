// src/auth/dto/create-user.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, MinLength, IsOptional, IsBoolean, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty
import { UserRole } from '../../users/schemas/user.schema'; // Assuming UserRole enum is defined here

export class CreateUserDto {
  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Muhammad Farrukh' })
  name: string;

  @ApiProperty({
    description: 'The email address of the user (must be unique)',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The user’s password (minimum 6 characters)',
    example: 'StrongPassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'The role of the user (GUEST, HOST, or ADMIN)',
    enum: UserRole, // Specifies that this property should be one of the UserRole enum values
    example: UserRole.GUEST,
    default: UserRole.GUEST,
    required: false, // Assuming it's optional and defaults
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    description: 'Whether the user account is verified',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({
    description: 'Token for email verification',
    example: 'some_random_hex_string',
    required: false,
  })
  @IsOptional()
  @IsString()
  verificationToken?: string;

  @ApiProperty({
    description: 'Expiration date for the verification token',
    example: '2025-06-15T12:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  verificationTokenExpires?: Date;
}
