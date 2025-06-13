import { BookingStatus } from '../enums/booking-status.enum';
export declare class UpdateBookingDto {
    checkInDate?: Date;
    checkOutDate?: Date;
    status?: BookingStatus;
}
