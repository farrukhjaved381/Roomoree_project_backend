// src/auth/dto/forgot-password.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'The email address associated with the account for password reset',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
