// src/bookings/dto/update-booking.dto.ts
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { BookingStatus } from '../enums/booking-status.enum';

export class UpdateBookingDto {
  @IsOptional()
  @IsDateString()
  checkInDate?: Date;

  @IsOptional()
  @IsDateString()
  checkOutDate?: Date;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
