// src/disputes/dto/resolve-dispute.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class ResolveDisputeDto {
  @ApiProperty({ enum: ['resolved', 'rejected'], default: 'resolved' })
  @IsIn(['resolved', 'rejected'])
  status: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  resolutionNote?: string;
}
