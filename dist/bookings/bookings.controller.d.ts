import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './schemas/booking.schema';
import { PopulatedBooking } from './interfaces/populated-booking.interface';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    createBooking(dto: CreateBookingDto, req: any): Promise<PopulatedBooking>;
    findMyBookings(req: any): Promise<PopulatedBooking[]>;
    getUpcomingBookings(req: any): Promise<PopulatedBooking[]>;
    getPastBookings(req: any): Promise<PopulatedBooking[]>;
    findHostBookings(req: any): Promise<PopulatedBooking[]>;
    delete(id: string, req: any): Promise<void>;
    acceptBooking(id: string, req: any): Promise<PopulatedBooking>;
    declineBooking(id: string, req: any): Promise<PopulatedBooking>;
    getGuestCalendar(req: any): Promise<Booking[]>;
    getHostCalendar(req: any): Promise<Booking[]>;
    checkAvailability(roomId: string, from: string, to: string): Promise<{
        roomId: string;
        available: boolean;
        conflicts: (import("mongoose").Document<unknown, {}, Booking, {}> & Booking & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
}
