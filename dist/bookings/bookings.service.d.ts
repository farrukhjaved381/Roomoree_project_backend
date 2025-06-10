import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsService {
    private bookingModel;
    constructor(bookingModel: Model<BookingDocument>);
    create(createDto: CreateBookingDto, guestId: string): Promise<Booking>;
    findGuestBookings(guestId: string): Promise<Booking[]>;
    findHostBookings(hostId: string): Promise<Booking[]>;
    deleteBooking(id: string, userId: string): Promise<void>;
}
