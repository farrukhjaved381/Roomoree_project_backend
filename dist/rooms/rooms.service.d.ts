import { Model } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
export declare class RoomsService {
    private roomModel;
    constructor(roomModel: Model<RoomDocument>);
    create(dto: CreateRoomDto, images: string[], hostId: string): Promise<import("mongoose").Document<unknown, {}, RoomDocument, {}> & Room & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<Room[]>;
    findById(id: string): Promise<Room>;
    update(id: string, updateDto: UpdateRoomDto): Promise<Room>;
    delete(id: string): Promise<void>;
    searchRooms(filters: {
        location?: string;
        minPrice?: number;
        maxPrice?: number;
        keyword?: string;
    }): Promise<Room[]>;
    findByIdWithDetails(id: string): Promise<(import("mongoose").Document<unknown, {}, RoomDocument, {}> & Room & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
