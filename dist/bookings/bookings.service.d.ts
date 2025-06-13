import { Model, Document } from 'mongoose';
import { Booking } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Room } from '../rooms/schemas/room.schema';
import { PopulatedBooking } from './interfaces/populated-booking.interface';
export declare class BookingsService {
    private bookingModel;
    private roomModel;
    constructor(bookingModel: Model<Booking>, roomModel: Model<Room>);
    create(dto: CreateBookingDto, guestId: string): Promise<PopulatedBooking>;
    findGuestBookings(guestId: string): Promise<PopulatedBooking[]>;
    findHostBookings(hostId: string): Promise<PopulatedBooking[]>;
    deleteBooking(id: string, userId: string): Promise<void>;
    acceptBooking(bookingId: string, hostId: string): Promise<PopulatedBooking>;
    declineBooking(bookingId: string, hostId: string): Promise<PopulatedBooking>;
    getUpcomingBookings(guestId: string): Promise<PopulatedBooking[]>;
    getPastBookings(guestId: string): Promise<PopulatedBooking[]>;
    getGuestCalendar(userId: string): Promise<Booking[]>;
    getHostCalendar(userId: string): Promise<Booking[]>;
    checkRoomAvailability(roomId: string, from: Date, to: Date): Promise<{
        roomId: string;
        available: boolean;
        conflicts: (Document<unknown, {}, Booking, {}> & Booking & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
}
