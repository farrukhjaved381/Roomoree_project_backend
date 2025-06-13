"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_schema_1 = require("./schemas/review.schema");
const booking_schema_1 = require("../bookings/schemas/booking.schema");
let ReviewsService = class ReviewsService {
    reviewModel;
    bookingModel;
    constructor(reviewModel, bookingModel) {
        this.reviewModel = reviewModel;
        this.bookingModel = bookingModel;
    }
    async create(dto, reviewerId) {
        const booking = await this.bookingModel
            .findById(dto.booking)
            .populate([
            { path: 'room', populate: { path: 'host' } },
            { path: 'guest', select: '-password -__v' },
        ])
            .exec();
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const guest = booking.guest;
        const host = booking.room.host;
        const isGuest = guest._id.toString() === reviewerId;
        const isHost = host._id.toString() === reviewerId;
        if (!isGuest && !isHost)
            throw new common_1.BadRequestException('You are not allowed to review this booking');
        const existing = await this.reviewModel.findOne({
            reviewer: reviewerId,
            booking: dto.booking,
        });
        if (existing)
            throw new common_1.BadRequestException('You already reviewed this booking');
        const review = new this.reviewModel({
            ...dto,
            reviewer: reviewerId,
        });
        return review.save();
    }
    async getUserReviews(userId) {
        return this.reviewModel.find({ reviewee: userId }).populate('reviewer', '-password');
    }
    async findByRoom(roomId) {
        return this.reviewModel.find({ room: roomId }).populate('guest', 'name');
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __param(1, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map