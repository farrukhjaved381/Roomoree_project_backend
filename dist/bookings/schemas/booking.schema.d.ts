import mongoose, { Document } from 'mongoose';
import { BookingStatus } from '../enums/booking-status.enum';
export declare class Booking extends Document {
    guest: mongoose.Types.ObjectId;
    room: mongoose.Types.ObjectId;
    checkInDate: Date;
    checkOutDate: Date;
    status: BookingStatus;
}
export declare const BookingSchema: mongoose.Schema<Booking, mongoose.Model<Booking, any, any, any, mongoose.Document<unknown, any, Booking, any> & Booking & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Booking, mongoose.Document<unknown, {}, mongoose.FlatRecord<Booking>, {}> & mongoose.FlatRecord<Booking> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
