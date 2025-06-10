// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'; // MinLength might be needed here too
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty

export class LoginDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The user’s password',
    example: 'StrongPassword123',
    minLength: 6, // Added minLength as it's typically validated for login
  })
  @IsString()
  @IsNotEmpty() // Ensure password is not empty
  @MinLength(6) // Added minLength as it's typically validated for login
  password: string;
}
