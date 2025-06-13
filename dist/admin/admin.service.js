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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const booking_schema_1 = require("../bookings/schemas/booking.schema");
const room_schema_1 = require("../rooms/schemas/room.schema");
let AdminService = class AdminService {
    userModel;
    bookingModel;
    roomModel;
    constructor(userModel, bookingModel, roomModel) {
        this.userModel = userModel;
        this.bookingModel = bookingModel;
        this.roomModel = roomModel;
    }
    async findAllUsers() {
        return this.userModel.find().select('-password');
    }
    async deleteUser(id) {
        return this.userModel.findByIdAndDelete(id);
    }
    async updateUser(id, dto) {
        const user = await this.userModel.findByIdAndUpdate(id, dto, { new: true });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async findAllBookings() {
        return this.bookingModel
            .find()
            .populate([
            { path: 'room', populate: { path: 'host' } },
            { path: 'guest', select: '-password' },
        ]);
    }
    async deleteBooking(id) {
        return this.bookingModel.findByIdAndDelete(id);
    }
    async updateBooking(id, dto) {
        const booking = await this.bookingModel.findByIdAndUpdate(id, dto, {
            new: true,
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        return booking;
    }
    async getAllRooms() {
        return this.roomModel.find().populate('host', '-password -__v');
    }
    async deleteRoom(roomId) {
        const room = await this.roomModel.findById(roomId);
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        await this.roomModel.findByIdAndDelete(roomId);
        return { message: 'Room deleted successfully' };
    }
    async updateRoom(id, updateDto) {
        const updated = await this.roomModel
            .findByIdAndUpdate(id, updateDto, { new: true })
            .populate('host', '-password -__v');
        if (!updated)
            throw new common_1.NotFoundException('Room not found');
        return updated;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(2, (0, mongoose_1.InjectModel)(room_schema_1.Room.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AdminService);
//# sourceMappingURL=admin.service.js.map