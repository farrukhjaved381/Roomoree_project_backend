import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { Booking } from './schemas/booking.schema';
import { BookingStatus } from './enums/booking-status.enum';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Room } from '../rooms/schemas/room.schema';
import { User } from '../users/schemas/user.schema';
import { PopulatedBooking } from './interfaces/populated-booking.interface';

type BookingDocument = Booking & Document;

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
  ) { }

  async create(dto: CreateBookingDto, guestId: string): Promise<PopulatedBooking> {
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
      throw new BadRequestException('This room is already booked during those dates.');
    }

    const booking = new this.bookingModel({
      room,
      guest: guestId,
      checkInDate,
      checkOutDate,
      status: BookingStatus.PENDING,
    });

    const savedBooking = await booking.save();
    return this.bookingModel
      .findById(savedBooking._id)
      .populate([
        { path: 'room', populate: { path: 'host' } },
        { path: 'guest', select: '-password -__v' },
      ])
      .exec() as unknown as PopulatedBooking;
  }

  async findGuestBookings(guestId: string): Promise<PopulatedBooking[]> {
    return (await this.bookingModel
      .find({ guest: guestId })
      .populate([
        { path: 'room', populate: { path: 'host' } },
        { path: 'guest', select: '-password -__v' },
      ])
      .exec()) as unknown as PopulatedBooking[];
  }

  async findHostBookings(hostId: string): Promise<PopulatedBooking[]> {
    return (await this.bookingModel
      .find()
      .populate([
        { path: 'room', populate: { path: 'host' } },
        { path: 'guest', select: '-password -__v' },
      ])
      .exec()) as unknown as PopulatedBooking[];
  }

  async deleteBooking(id: string, userId: string): Promise<void> {
    const booking = await this.bookingModel
      .findById(id)
      .populate([
        { path: 'room', populate: { path: 'host' } },
        { path: 'guest', select: '-password -__v' },
      ])
      .exec() as unknown as PopulatedBooking;

    if (!booking) throw new NotFoundException('Booking not found');

    const guest = booking.guest as User & { _id: any };
    const host = booking.room.host as User & { _id: any };

    if (guest._id.toString() !== userId && host._id.toString() !== userId) {
      throw new ForbiddenException('You are not allowed to cancel this booking');
    }

    await this.bookingModel.findByIdAndDelete(id);
  }

  async acceptBooking(bookingId: string, hostId: string): Promise<PopulatedBooking> {
    const booking = await this.bookingModel
      .findById(bookingId)
      .populate([
        { path: 'room', populate: { path: 'host' } },
        { path: 'guest', select: '-password -__v' },
      ])
      .exec() as unknown as PopulatedBooking & Document;

    if (!booking) throw new NotFoundException('Booking not found.');

    const host = booking.room.host as User & { _id: any };
    if (host._id.toString() !== hostId) {
      throw new ForbiddenException('You are not allowed to accept this booking.');
    }

    booking.status = BookingStatus.ACCEPTED;
    await booking.save();

    return this.bookingModel
      .findById(bookingId)
      .populate([
        { path: 'room', populate: { path: 'host' } },
        { path: 'guest', select: '-password -__v' },
      ])
      .exec() as unknown as PopulatedBooking;
  }

  async declineBooking(bookingId: string, hostId: string): Promise<PopulatedBooking> {
    const booking = await this.bookingModel
      .findById(bookingId)
      .populate([
        { path: 'room', populate: { path: 'host' } },
        { path: 'guest', select: '-password -__v' },
      ])
      .exec() as unknown as PopulatedBooking & Document;

    if (!booking) throw new NotFoundException('Booking not found.');

    const host = booking.room.host as User & { _id: any };
    if (host._id.toString() !== hostId) {
      throw new ForbiddenException('You are not allowed to decline this booking.');
    }

    booking.status = BookingStatus.DECLINED;
    await booking.save();

    return this.bookingModel
      .findById(bookingId)
      .populate([
        { path: 'room', populate: { path: 'host' } },
        { path: 'guest', select: '-password -__v' },
      ])
      .exec() as unknown as PopulatedBooking;
  }

  async getUpcomingBookings(guestId: string): Promise<PopulatedBooking[]> {
    return this.bookingModel
      .find({
        guest: guestId,
        checkInDate: { $gte: new Date() },
      })
      .populate([
        { path: 'room', populate: { path: 'host' } },
        { path: 'guest', select: '-password -__v' },
      ])
      .exec() as unknown as PopulatedBooking[];
  }

  async getPastBookings(guestId: string): Promise<PopulatedBooking[]> {
    return this.bookingModel
      .find({
        guest: guestId,
        checkOutDate: { $lt: new Date() },
      })
      .populate([
        { path: 'room', populate: { path: 'host' } },
        { path: 'guest', select: '-password -__v' },
      ])
      .exec() as unknown as PopulatedBooking[];
  }

  async getGuestCalendar(userId: string): Promise<Booking[]> {
    return this.bookingModel
      .find({ guest: userId, status: BookingStatus.ACCEPTED })
      .select('checkInDate checkOutDate room')
      .populate({ path: 'room', select: 'title location price images' })
      .exec();
  }

  async getHostCalendar(userId: string): Promise<Booking[]> {
    // Get rooms owned by host
    const rooms = await this.roomModel.find({ host: userId }).select('_id');
    const roomIds = rooms.map(r => r._id);

    return this.bookingModel
      .find({ room: { $in: roomIds }, status: BookingStatus.ACCEPTED })
      .select('checkInDate checkOutDate guest room')
      .populate([
        { path: 'guest', select: 'name email' },
        { path: 'room', select: 'title location price images' },
      ])
      .exec();
  }


async checkRoomAvailability(roomId: string, from: Date, to: Date) {
  const conflicts = await this.bookingModel.find({
    room: roomId,
    status: BookingStatus.ACCEPTED,
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

}
