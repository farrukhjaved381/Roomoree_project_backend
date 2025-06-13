import { IsDateString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: '68492e0d856a68598aabb5cb', description: 'Room ID' })
  @IsMongoId()
  room: string;

  @ApiProperty({ example: '2025-06-20', description: 'Check-in date (YYYY-MM-DD)' })
  @IsDateString()
  checkInDate: string;

  @ApiProperty({ example: '2025-06-25', description: 'Check-out date (YYYY-MM-DD)' })
  @IsDateString()
  checkOutDate: string;
}
