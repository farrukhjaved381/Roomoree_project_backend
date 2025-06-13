import { RoomsService } from './rooms.service';
export declare class AdminRoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    getAllRoomsForAdmin(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/room.schema").RoomDocument, {}> & import("./schemas/room.schema").Room & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    deleteRoomByAdmin(id: string): Promise<void>;
}
