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
const booking_status_enum_1 = require("./enums/booking-status.enum");
const room_schema_1 = require("../rooms/schemas/room.schema");
let BookingsService = class BookingsService {
    bookingModel;
    roomModel;
    constructor(bookingModel, roomModel) {
        this.bookingModel = bookingModel;
        this.roomModel = roomModel;
    }
    async create(dto, guestId) {
        const { room, checkInDate, checkOutDate } = dto;
        const conflict = await this.bookingModel.exists({
            room,
            $or: [
                {
                    checkInDate: { $lt: new Date(checkOutDate) },
                    checkOutDate: { $gt: new Date(checkInDate) },
                },
            ],
        });
        if (conflict) {
            throw new common_1.BadRequestException('This room is already booked during those dates.');
        }
        const booking = new this.bookingModel({
            room,
            guest: guestId,
            checkInDate,
            checkOutDate,
            status: booking_status_enum_1.BookingStatus.PENDING,
        });
        const savedBooking = await booking.save();
        return this.bookingModel
            .findById(savedBooking._id)
            .populate([
            { path: 'room', populate: { path: 'host' } },
            { path: 'guest', select: '-password -__v' },
        ])
            .exec();
    }
    async findGuestBookings(guestId) {
        return (await this.bookingModel
            .find({ guest: guestId })
            .populate([
            { path: 'room', populate: { path: 'host' } },
            { path: 'guest', select: '-password -__v' },
        ])
            .exec());
    }
    async findHostBookings(hostId) {
        return (await this.bookingModel
            .find()
            .populate([
            { path: 'room', populate: { path: 'host' } },
            { path: 'guest', select: '-password -__v' },
        ])
            .exec());
    }
    async deleteBooking(id, userId) {
        const booking = await this.bookingModel
            .findById(id)
            .populate([
            { path: 'room', populate: { path: 'host' } },
            { path: 'guest', select: '-password -__v' },
        ])
            .exec();
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const guest = booking.guest;
        const host = booking.room.host;
        if (guest._id.toString() !== userId && host._id.toString() !== userId) {
            throw new common_1.ForbiddenException('You are not allowed to cancel this booking');
        }
        await this.bookingModel.findByIdAndDelete(id);
    }
    async acceptBooking(bookingId, hostId) {
        const booking = await this.bookingModel
            .findById(bookingId)
            .populate([
            { path: 'room', populate: { path: 'host' } },
            { path: 'guest', select: '-password -__v' },
        ])
            .exec();
        if (!booking)
            throw new common_1.NotFoundException('Booking not found.');
        const host = booking.room.host;
        if (host._id.toString() !== hostId) {
            throw new common_1.ForbiddenException('You are not allowed to accept this booking.');
        }
        booking.status = booking_status_enum_1.BookingStatus.ACCEPTED;
        await booking.save();
        return this.bookingModel
            .findById(bookingId)
            .populate([
            { path: 'room', populate: { path: 'host' } },
            { path: 'guest', select: '-password -__v' },
        ])
            .exec();
    }
    async declineBooking(bookingId, hostId) {
        const booking = await this.bookingModel
            .findById(bookingId)
            .populate([
            { path: 'room', populate: { path: 'host' } },
            { path: 'guest', select: '-password -__v' },
        ])
            .exec();
        if (!booking)
            throw new common_1.NotFoundException('Booking not found.');
        const host = booking.room.host;
        if (host._id.toString() !== hostId) {
            throw new common_1.ForbiddenException('You are not allowed to decline this booking.');
        }
        booking.status = booking_status_enum_1.BookingStatus.DECLINED;
        await booking.save();
        return this.bookingModel
            .findById(bookingId)
            .populate([
            { path: 'room', populate: { path: 'host' } },
            { path: 'guest', select: '-password -__v' },
        ])
            .exec();
    }
    async getUpcomingBookings(guestId) {
        return this.bookingModel
            .find({
            guest: guestId,
            checkInDate: { $gte: new Date() },
        })
            .populate([
            { path: 'room', populate: { path: 'host' } },
            { path: 'guest', select: '-password -__v' },
        ])
            .exec();
    }
    async getPastBookings(guestId) {
        return this.bookingModel
            .find({
            guest: guestId,
            checkOutDate: { $lt: new Date() },
        })
            .populate([
            { path: 'room', populate: { path: 'host' } },
            { path: 'guest', select: '-password -__v' },
        ])
            .exec();
    }
    async getGuestCalendar(userId) {
        return this.bookingModel
            .find({ guest: userId, status: booking_status_enum_1.BookingStatus.ACCEPTED })
            .select('checkInDate checkOutDate room')
            .populate({ path: 'room', select: 'title location price images' })
            .exec();
    }
    async getHostCalendar(userId) {
        const rooms = await this.roomModel.find({ host: userId }).select('_id');
        const roomIds = rooms.map(r => r._id);
        return this.bookingModel
            .find({ room: { $in: roomIds }, status: booking_status_enum_1.BookingStatus.ACCEPTED })
            .select('checkInDate checkOutDate guest room')
            .populate([
            { path: 'guest', select: 'name email' },
            { path: 'room', select: 'title location price images' },
        ])
            .exec();
    }
    async checkRoomAvailability(roomId, from, to) {
        const conflicts = await this.bookingModel.find({
            room: roomId,
            status: booking_status_enum_1.BookingStatus.ACCEPTED,
            $or: [
                {
                    checkInDate: { $lt: to },
                    checkOutDate: { $gt: from },
                }
            ],
        }).select('checkInDate checkOutDate');
        return {
            roomId,
            available: conflicts.length === 0,
            conflicts,
        };
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(1, (0, mongoose_1.InjectModel)(room_schema_1.Room.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map