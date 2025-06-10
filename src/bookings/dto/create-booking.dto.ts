// File: src/bookings/dto/create-booking.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateBookingDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ example: 'roomObjectIdHere' })
  room: string;

  @IsDateString()
  @ApiProperty({ example: '2025-06-15' })
  checkInDate: string;

  @IsDateString()
  @ApiProperty({ example: '2025-06-18' })
  checkOutDate: string;
}