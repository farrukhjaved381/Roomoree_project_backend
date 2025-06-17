import { AdminService } from './admin.service';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UpdateBookingDto } from '../bookings/dto/update-booking.dto';
import { UpdateRoomDto } from '../rooms/dto/update-room.dto';
import { Room } from '../rooms/schemas/room.schema';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getAnalytics(): Promise<{
        totalUsers: number;
        totalHosts: number;
        totalGuests: number;
        totalRooms: number;
        totalBookings: number;
        totalDisputes: number;
        totalRevenue: any;
    }>;
    findAllUsers(): Promise<(import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").UserDocument, {}> & import("../users/schemas/user.schema").User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    deleteUser(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").UserDocument, {}> & import("../users/schemas/user.schema").User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    updateUser(id: string, updateDto: UpdateUserDto): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").UserDocument, {}> & import("../users/schemas/user.schema").User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAllBookings(): Promise<(import("mongoose").Document<unknown, {}, import("../bookings/schemas/booking.schema").BookingDocument, {}> & import("../bookings/schemas/booking.schema").Booking & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    deleteBooking(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../bookings/schemas/booking.schema").BookingDocument, {}> & import("../bookings/schemas/booking.schema").Booking & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    updateBooking(id: string, updateDto: UpdateBookingDto): Promise<import("mongoose").Document<unknown, {}, import("../bookings/schemas/booking.schema").BookingDocument, {}> & import("../bookings/schemas/booking.schema").Booking & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAllRooms(): Promise<(import("mongoose").Document<unknown, {}, import("../rooms/schemas/room.schema").RoomDocument, {}> & Room & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    deleteRoom(roomId: string): Promise<{
        message: string;
    }>;
    updateRoom(roomId: string, updateDto: UpdateRoomDto): Promise<import("mongoose").Document<unknown, {}, import("../rooms/schemas/room.schema").RoomDocument, {}> & Room & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
