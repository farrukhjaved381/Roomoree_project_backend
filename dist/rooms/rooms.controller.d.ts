import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Multer } from 'multer';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    findByFilter(location?: string, minPrice?: number, maxPrice?: number, keyword?: string): Promise<import("./schemas/room.schema").Room[]>;
    createRoom(dto: CreateRoomDto, files: Multer.File[], req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/room.schema").RoomDocument, {}> & import("./schemas/room.schema").Room & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<import("./schemas/room.schema").Room[]>;
    update(id: string, updateDto: UpdateRoomDto): Promise<import("./schemas/room.schema").Room>;
    delete(id: string): Promise<void>;
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/room.schema").RoomDocument, {}> & import("./schemas/room.schema").Room & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
