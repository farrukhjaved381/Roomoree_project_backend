import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  async create(dto: CreateRoomDto, images: string[], hostId: string) {
    const newRoom = new this.roomModel({
      ...dto,
      host: hostId,
      images,
    });
    return newRoom.save();
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

  async searchRooms(filters: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    keyword?: string;
  }): Promise<Room[]> {
    const query: any = {};
  
    if (filters.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }
  
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = filters.minPrice;
      if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }
  
    if (filters.keyword) {
      query.$or = [
        { title: { $regex: filters.keyword, $options: 'i' } },
        { description: { $regex: filters.keyword, $options: 'i' } },
      ];
    }
  
    return this.roomModel
      .find(query)
      .populate('host', 'name email') // optional host info
      .exec();
  }
  async findByIdWithDetails(id: string) {
    return this.roomModel
      .findById(id)
      .populate('host', 'name email') // Show host basic info
      .populate({
        path: 'reviews',
        populate: { path: 'guest', select: 'name' } // if you link reviews
      })
      .exec();
  }


async getAllRoomsWithHost() {
  return this.roomModel
    .find()
    .populate('host', 'name email role') // show host info
    .exec();
}

}
