// src/payments/dto/create-checkout-session.dto.ts
import { IsString, IsNumber } from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsString()
  bookingId: string;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  successUrl: string;

  @IsString()
  cancelUrl: string;

  @IsString()
  userId: string; // ✅ Added: required for tracking
}
