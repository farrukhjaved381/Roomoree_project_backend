// src/reviews/reviews.controller.ts
import { Controller, Post, Body, Req, UseGuards, Get, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { Review } from './schemas/review.schema';

@ApiTags('Reviews')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @Roles(UserRole.GUEST, UserRole.HOST)
  @ApiOperation({ summary: 'Submit a review after a completed stay' })
  @ApiResponse({ status: 201, description: 'Review created successfully', type: Review })
  @ApiResponse({ status: 400, description: 'Already reviewed or invalid request' })
  async createReview(@Body() dto: CreateReviewDto, @Req() req) {
    return this.reviewsService.create(dto, req.user._id);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get reviews for a user (host or guest)' })
  @ApiResponse({ status: 200, description: 'Returns all reviews for user', type: [Review] })
  async getReviewsForUser(@Param('userId') userId: string) {
    return this.reviewsService.getUserReviews(userId);
  }
}
