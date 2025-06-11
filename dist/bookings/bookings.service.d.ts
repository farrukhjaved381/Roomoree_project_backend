import { Model, Document } from 'mongoose';
import { Booking } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Room } from '../rooms/schemas/room.schema';
import { User } from '../users/schemas/user.schema';
type BookingDocument = Booking & Document;
type PopulatedRoom = Omit<Room, 'host'> & {
    host: User;
};
type PopulatedBooking = Omit<BookingDocument, 'room'> & {
    room: PopulatedRoom;
};
export declare class BookingsService {
    private bookingModel;
    private roomModel;
    constructor(bookingModel: Model<Booking>, roomModel: Model<Room>);
    create(createDto: CreateBookingDto, guestId: string): Promise<Booking>;
    findGuestBookings(guestId: string): Promise<PopulatedBooking[]>;
    findHostBookings(hostId: string): Promise<PopulatedBooking[]>;
    deleteBooking(id: string, userId: string): Promise<void>;
    acceptBooking(bookingId: string, hostId: string): Promise<Document<unknown, {}, Booking, {}> & Booking & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    declineBooking(bookingId: string, hostId: string): Promise<Document<unknown, {}, Booking, {}> & Booking & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
export {};
