// src/admin/admin.service.ts


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UpdateBookingDto } from '../bookings/dto/update-booking.dto';
import { UpdateRoomDto } from '../rooms/dto/update-room.dto';
import { Room, RoomDocument } from '../rooms/schemas/room.schema';
import { Dispute } from 'src/disputes/schemas/dispute.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(Dispute.name) private disputeModel: Model<Dispute>,
  ) {}

  // get analytics
  async getAnalytics() {
    const [totalUsers, totalHosts, totalGuests] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ role: /host/i }),   // fix
      this.userModel.countDocuments({ role: /guest/i }),  // fix
    ]);
    

    const totalRooms = await this.roomModel.countDocuments();
    const totalBookings = await this.bookingModel.countDocuments();
    const totalDisputes = await this.disputeModel.countDocuments();

    const revenueResult = await this.bookingModel.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    return {
      totalUsers,
      totalHosts,
      totalGuests,
      totalRooms,
      totalBookings,
      totalDisputes,
      totalRevenue,
    };
  }

  // USERS
  async findAllUsers() {
    return this.userModel.find().select('-password');
  }

  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(id, dto, { new: true });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // BOOKINGS
  async findAllBookings() {
    return this.bookingModel
      .find()
      .populate([
        { path: 'room', populate: { path: 'host' } },
        { path: 'guest', select: '-password' },
      ]);
  }

  async deleteBooking(id: string) {
    return this.bookingModel.findByIdAndDelete(id);
  }

  async updateBooking(id: string, dto: UpdateBookingDto) {
    const booking = await this.bookingModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }
  // rooms/property
  async getAllRooms() {
    return this.roomModel.find().populate('host', '-password -__v');
  }

  async deleteRoom(roomId: string) {
    const room = await this.roomModel.findById(roomId);
    if (!room) throw new NotFoundException('Room not found');
    await this.roomModel.findByIdAndDelete(roomId);
    return { message: 'Room deleted successfully' };
  }

  async updateRoom(id: string, updateDto: UpdateRoomDto) {
    const updated = await this.roomModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .populate('host', '-password -__v');
    if (!updated) throw new NotFoundException('Room not found');
    return updated;
  }
}
