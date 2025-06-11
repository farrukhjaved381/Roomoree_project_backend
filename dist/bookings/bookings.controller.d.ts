import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(dto: CreateBookingDto, req: any): Promise<import("./schemas/booking.schema").Booking>;
    findMyBookings(req: any): Promise<(Omit<import("./schemas/booking.schema").Booking & import("mongoose").Document<unknown, any, any, Record<string, any>>, "room"> & {
        room: Omit<import("../rooms/schemas/room.schema").Room, "host"> & {
            host: import("../users/schemas/user.schema").User;
        };
    })[]>;
    findHostBookings(req: any): Promise<(Omit<import("./schemas/booking.schema").Booking & import("mongoose").Document<unknown, any, any, Record<string, any>>, "room"> & {
        room: Omit<import("../rooms/schemas/room.schema").Room, "host"> & {
            host: import("../users/schemas/user.schema").User;
        };
    })[]>;
    delete(id: string, req: any): Promise<void>;
    acceptBooking(id: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/booking.schema").Booking, {}> & import("./schemas/booking.schema").Booking & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    declineBooking(id: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/booking.schema").Booking, {}> & import("./schemas/booking.schema").Booking & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
