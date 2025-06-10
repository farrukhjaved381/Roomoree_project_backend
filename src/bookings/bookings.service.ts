// File: src/bookings/bookings.service.ts

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Room } from '../rooms/schemas/room.schema';

type PopulatedBooking = Omit<BookingDocument, 'room'> & { room: Room };

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>
  ) {}

  async create(createDto: CreateBookingDto, guestId: string): Promise<Booking> {
    const booking = new this.bookingModel({ ...createDto, guest: guestId });
    return booking.save();
  }

  async findGuestBookings(guestId: string): Promise<Booking[]> {
    return this.bookingModel
      .find({ guest: guestId })
      .populate('room'); // ✅ Must populate here
  }
  

  async findHostBookings(hostId: string): Promise<Booking[]> {
    return this.bookingModel.find().populate({
      path: 'room',
      match: { host: hostId },
    });
  }

  async deleteBooking(id: string, userId: string): Promise<void> {
    const booking = await this.bookingModel.findById(id).populate('room').exec() as unknown as PopulatedBooking;
    if (!booking) throw new NotFoundException('Booking not found');

    if (
      booking.guest.toString() !== userId &&
      booking.room.host.toString() !== userId
    ) {
      throw new ForbiddenException('You are not allowed to cancel this booking');
    }

    await this.bookingModel.findByIdAndDelete(id);
  }
}