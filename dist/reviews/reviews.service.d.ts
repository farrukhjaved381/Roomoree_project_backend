import { Model } from 'mongoose';
import { Review } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { Booking } from '../bookings/schemas/booking.schema';
export declare class ReviewsService {
    private reviewModel;
    private bookingModel;
    constructor(reviewModel: Model<Review>, bookingModel: Model<Booking>);
    create(dto: CreateReviewDto, reviewerId: string): Promise<Review>;
    getUserReviews(userId: string): Promise<Review[]>;
    findByRoom(roomId: string): Promise<Review[]>;
}
