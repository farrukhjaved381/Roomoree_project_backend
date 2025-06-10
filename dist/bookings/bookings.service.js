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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("./schemas/booking.schema");
let BookingsService = class BookingsService {
    bookingModel;
    constructor(bookingModel) {
        this.bookingModel = bookingModel;
    }
    async create(createDto, guestId) {
        const booking = new this.bookingModel({ ...createDto, guest: guestId });
        return booking.save();
    }
    async findGuestBookings(guestId) {
        return this.bookingModel
            .find({ guest: guestId })
            .populate('room');
    }
    async findHostBookings(hostId) {
        return this.bookingModel.find().populate({
            path: 'room',
            match: { host: hostId },
        });
    }
    async deleteBooking(id, userId) {
        const booking = await this.bookingModel.findById(id).populate('room').exec();
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.guest.toString() !== userId &&
            booking.room.host.toString() !== userId) {
            throw new common_1.ForbiddenException('You are not allowed to cancel this booking');
        }
        await this.bookingModel.findByIdAndDelete(id);
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map