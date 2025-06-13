// src/reviews/dto/create-review.dto.ts
import { IsNotEmpty, IsNumber, Max, Min, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  booking: string;

  @IsNotEmpty()
  reviewee: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;
}
