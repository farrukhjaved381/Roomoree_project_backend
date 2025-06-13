// src/disputes/dto/create-dispute.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateDisputeDto {
  @ApiProperty({ description: 'Booking ID related to the dispute' })
  @IsMongoId()
  booking: string;

  @ApiProperty({ description: 'Reason for dispute' })
  @IsNotEmpty()
  reason: string;
}
