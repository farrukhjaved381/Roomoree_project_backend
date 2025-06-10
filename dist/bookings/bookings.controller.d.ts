import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(dto: CreateBookingDto, req: any): Promise<import("./schemas/booking.schema").Booking>;
    findMyBookings(req: any): Promise<import("./schemas/booking.schema").Booking[]>;
    findHostBookings(req: any): Promise<import("./schemas/booking.schema").Booking[]>;
    delete(id: string, req: any): Promise<void>;
}
