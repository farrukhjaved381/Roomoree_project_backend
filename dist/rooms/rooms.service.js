"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const room_schema_1 = require("./schemas/room.schema");
let RoomsService = class RoomsService {
    roomModel;
    constructor(roomModel) {
        this.roomModel = roomModel;
    }
    async create(dto, images, hostId) {
        const newRoom = new this.roomModel({
            ...dto,
            host: hostId,
            images,
        });
        return newRoom.save();
    }
    async findAll() {
        return this.roomModel.find().populate('host', 'name email');
    }
    async findById(id) {
        const room = await this.roomModel.findById(id);
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        return room;
    }
    async update(id, updateDto) {
        const room = await this.roomModel.findByIdAndUpdate(id, updateDto, { new: true });
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        return room;
    }
    async delete(id) {
        const result = await this.roomModel.findByIdAndDelete(id);
        if (!result)
            throw new common_1.NotFoundException('Room not found');
    }
    async searchRooms(filters) {
        const query = {};
        if (filters.location) {
            query.location = { $regex: filters.location, $options: 'i' };
        }
        if (filters.minPrice || filters.maxPrice) {
            query.price = {};
            if (filters.minPrice)
                query.price.$gte = filters.minPrice;
            if (filters.maxPrice)
                query.price.$lte = filters.maxPrice;
        }
        if (filters.keyword) {
            query.$or = [
                { title: { $regex: filters.keyword, $options: 'i' } },
                { description: { $regex: filters.keyword, $options: 'i' } },
            ];
        }
        return this.roomModel
            .find(query)
            .populate('host', 'name email')
            .exec();
    }
    async findByIdWithDetails(id) {
        return this.roomModel
            .findById(id)
            .populate('host', 'name email')
            .populate({
            path: 'reviews',
            populate: { path: 'guest', select: 'name' }
        })
            .exec();
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(room_schema_1.Room.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map