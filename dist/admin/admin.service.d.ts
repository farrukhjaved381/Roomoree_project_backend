import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UpdateBookingDto } from '../bookings/dto/update-booking.dto';
import { UpdateRoomDto } from '../rooms/dto/update-room.dto';
import { Room, RoomDocument } from '../rooms/schemas/room.schema';
import { Dispute } from 'src/disputes/schemas/dispute.schema';
export declare class AdminService {
    private userModel;
    private bookingModel;
    private roomModel;
    private disputeModel;
    constructor(userModel: Model<UserDocument>, bookingModel: Model<BookingDocument>, roomModel: Model<RoomDocument>, disputeModel: Model<Dispute>);
    getAnalytics(): Promise<{
        totalUsers: number;
        totalHosts: number;
        totalGuests: number;
        totalRooms: number;
        totalBookings: number;
        totalDisputes: number;
        totalRevenue: any;
    }>;
    findAllUsers(): Promise<(import("mongoose").Document<unknown, {}, UserDocument, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    deleteUser(id: string): Promise<(import("mongoose").Document<unknown, {}, UserDocument, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    updateUser(id: string, dto: UpdateUserDto): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAllBookings(): Promise<(import("mongoose").Document<unknown, {}, BookingDocument, {}> & Booking & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    deleteBooking(id: string): Promise<(import("mongoose").Document<unknown, {}, BookingDocument, {}> & Booking & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    updateBooking(id: string, dto: UpdateBookingDto): Promise<import("mongoose").Document<unknown, {}, BookingDocument, {}> & Booking & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAllRooms(): Promise<(import("mongoose").Document<unknown, {}, RoomDocument, {}> & Room & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    deleteRoom(roomId: string): Promise<{
        message: string;
    }>;
    updateRoom(id: string, updateDto: UpdateRoomDto): Promise<import("mongoose").Document<unknown, {}, RoomDocument, {}> & Room & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
