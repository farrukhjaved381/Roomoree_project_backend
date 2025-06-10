import { Model } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
export declare class RoomsService {
    private roomModel;
    constructor(roomModel: Model<RoomDocument>);
    create(createRoomDto: CreateRoomDto, hostId: string): Promise<Room>;
    findAll(): Promise<Room[]>;
    findById(id: string): Promise<Room>;
    update(id: string, updateDto: UpdateRoomDto): Promise<Room>;
    delete(id: string): Promise<void>;
}
