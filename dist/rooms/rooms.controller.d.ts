import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    create(createRoomDto: CreateRoomDto, req: any): Promise<import("./schemas/room.schema").Room>;
    findAll(): Promise<import("./schemas/room.schema").Room[]>;
    findOne(id: string): Promise<import("./schemas/room.schema").Room>;
    update(id: string, updateDto: UpdateRoomDto): Promise<import("./schemas/room.schema").Room>;
    delete(id: string): Promise<void>;
}
