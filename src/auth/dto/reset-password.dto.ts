// src/auth/dto/reset-password.dto.ts
import { IsString, MinLength, IsNotEmpty } from 'class-validator'; // Added IsNotEmpty
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The password reset token received via email',
    example: 'random_reset_token_string',
  })
  @IsString()
  @IsNotEmpty() // Token should not be empty
  token: string;

  @ApiProperty({
    description: 'The new password for the user (minimum 6 characters)',
    example: 'NewSecurePassword456',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty() // New password should not be empty
  @MinLength(6)
  newPassword: string;
}
