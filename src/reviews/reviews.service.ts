// src/reviews/reviews.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { Booking } from '../bookings/schemas/booking.schema';
import { PopulatedBooking } from '../bookings/interfaces/populated-booking.interface';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
  ) {}

  async create(dto: CreateReviewDto, reviewerId: string): Promise<Review> {
    const booking = await this.bookingModel
      .findById(dto.booking)
      .populate([
        { path: 'room', populate: { path: 'host' } },
        { path: 'guest', select: '-password -__v' },
      ])
      .exec() as unknown as PopulatedBooking;
    if (!booking) throw new NotFoundException('Booking not found');

    const guest = booking.guest as User & { _id: any };
    const host = booking.room.host as User & { _id: any };
    const isGuest = guest._id.toString() === reviewerId;
    const isHost = host._id.toString() === reviewerId;

    if (!isGuest && !isHost)
      throw new BadRequestException('You are not allowed to review this booking');

    const existing = await this.reviewModel.findOne({
      reviewer: reviewerId,
      booking: dto.booking,
    });

    if (existing) throw new BadRequestException('You already reviewed this booking');

    const review = new this.reviewModel({
      ...dto,
      reviewer: reviewerId,
    });

    return review.save();
  }

  async getUserReviews(userId: string): Promise<Review[]> {
    return this.reviewModel.find({ reviewee: userId }).populate('reviewer', '-password');
  }


async findByRoom(roomId: string): Promise<Review[]> {
  return this.reviewModel.find({ room: roomId }).populate('guest', 'name');
}
}
































