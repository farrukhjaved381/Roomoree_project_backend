import { Document, Types } from 'mongoose';
import { BookingStatus } from '../enums/booking-status.enum';
export type BookingDocument = Booking & Document;
export declare class Booking {
    guest: Types.ObjectId;
    room: Types.ObjectId;
    checkInDate: Date;
    checkOutDate: Date;
    status: BookingStatus;
    paymentStatus: string;
    paymentIntentId?: string;
    paidAt?: Date;
    transactionId?: string;
}
export declare const BookingSchema: import("mongoose").Schema<Booking, import("mongoose").Model<Booking, any, any, any, Document<unknown, any, Booking, any> & Booking & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Booking, Document<unknown, {}, import("mongoose").FlatRecord<Booking>, {}> & import("mongoose").FlatRecord<Booking> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
