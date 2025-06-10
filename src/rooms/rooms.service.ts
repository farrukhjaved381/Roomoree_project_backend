import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  async create(createRoomDto: CreateRoomDto, hostId: string): Promise<Room> {
    const room = new this.roomModel({ ...createRoomDto, host: hostId });
    return room.save();
  }

  async findAll(): Promise<Room[]> {
    return this.roomModel.find().populate('host', 'name email');
  }

  async findById(id: string): Promise<Room> {
    const room = await this.roomModel.findById(id);
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async update(id: string, updateDto: UpdateRoomDto): Promise<Room> {
    const room = await this.roomModel.findByIdAndUpdate(id, updateDto, { new: true });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async delete(id: string): Promise<void> {
    const result = await this.roomModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Room not found');
  }
}
