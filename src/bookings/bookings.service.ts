// File: src/bookings/bookings.service.ts

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { Booking } from './schemas/booking.schema';
import { BookingStatus } from './enums/booking-status.enum';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Room } from '../rooms/schemas/room.schema';
import { User } from '../users/schemas/user.schema';

type BookingDocument = Booking & Document;
type PopulatedRoom = Omit<Room, 'host'> & { host: User };
type PopulatedBooking = Omit<BookingDocument, 'room'> & { room: PopulatedRoom };

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
  ) {}

  async create(createDto: CreateBookingDto, guestId: string): Promise<Booking> {
    const booking = new this.bookingModel({ ...createDto, guest: guestId });
    return booking.save();
  }

  async findGuestBookings(guestId: string): Promise<PopulatedBooking[]> {
    return (await this.bookingModel
      .find({ guest: guestId })
      .populate({ path: 'room', populate: { path: 'host' } })
      .exec()) as unknown as PopulatedBooking[];
  }

  async findHostBookings(hostId: string): Promise<PopulatedBooking[]> {
    return (await this.bookingModel
      .find()
      .populate({
        path: 'room',
        populate: { path: 'host' },
        match: { host: hostId },
      })
      .exec()) as unknown as PopulatedBooking[];
  }

  async deleteBooking(id: string, userId: string): Promise<void> {
    const booking = await this.bookingModel
      .findById(id)
      .populate({ path: 'room', populate: { path: 'host' } })
      .exec() as unknown as PopulatedBooking;
    if (!booking) throw new NotFoundException('Booking not found');

    if (
      booking.guest.toString() !== userId &&
      booking.room.host.toString() !== userId
    ) {
      throw new ForbiddenException('You are not allowed to cancel this booking');
    }

    await this.bookingModel.findByIdAndDelete(id);
  }

  async acceptBooking(bookingId: string, hostId: string) {
    const booking = await this.bookingModel
      .findById(bookingId)
      .populate({
        path: 'room',
        populate: { path: 'host' }
      })
      .exec();
  
    if (!booking) throw new NotFoundException('Booking not found.');
    
    // Force the types to help TS understand
    const room: any = booking.room; // populated room
    const host: any = room.host; // populated host
  
    const roomHostId = host._id?.toString?.() ?? host?.toString?.();
  
    console.log('Host in DB:', roomHostId);
    console.log('Host from token:', hostId);
  
    if (roomHostId !== hostId) {
      throw new ForbiddenException('You are not allowed to accept this booking.');
    }
  
    booking.status = BookingStatus.ACCEPTED;
    return booking.save();
  }
  

  async declineBooking(bookingId: string, hostId: string) {
    const booking = await this.bookingModel
      .findById(bookingId)
      .populate({
        path: 'room',
        populate: { path: 'host' }
      })
      .exec();
  
    if (!booking) throw new NotFoundException('Booking not found.');
  
    const room: any = booking.room;
    const host: any = room.host;
  
    const roomHostId = host._id?.toString?.() ?? host?.toString?.();
  
    console.log('Host in DB:', roomHostId);
    console.log('Host from token:', hostId);
  
    if (roomHostId !== hostId) {
      throw new ForbiddenException('You are not allowed to decline this booking.');
    }
  
    booking.status = BookingStatus.DECLINED;
    return booking.save();
  }
  
}