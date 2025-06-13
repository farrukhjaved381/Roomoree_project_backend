import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './schemas/review.schema';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(dto: CreateReviewDto, req: any): Promise<Review>;
    getReviewsForUser(userId: string): Promise<Review[]>;
}
