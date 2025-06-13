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
exports.AdminRoomsController = exports.RoomsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rooms_service_1 = require("./rooms.service");
const create_room_dto_1 = require("./dto/create-room.dto");
const update_room_dto_1 = require("./dto/update-room.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_schema_1 = require("../users/schemas/user.schema");
const swagger_2 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const uuid_1 = require("uuid");
const path_1 = require("path");
let RoomsController = class RoomsController {
    roomsService;
    constructor(roomsService) {
        this.roomsService = roomsService;
    }
    findByFilter(location, minPrice, maxPrice, keyword) {
        return this.roomsService.searchRooms({ location, minPrice, maxPrice, keyword });
    }
    async createRoom(dto, files, req) {
        dto.price = Number(dto.price);
        const imagePaths = files.map(file => `/uploads/rooms/${file.filename}`);
        return this.roomsService.create(dto, imagePaths, req.user._id);
    }
    findAll() {
        return this.roomsService.findAll();
    }
    update(id, updateDto) {
        return this.roomsService.update(id, updateDto);
    }
    delete(id) {
        return this.roomsService.delete(id);
    }
    findOne(id) {
        return this.roomsService.findByIdWithDetails(id);
    }
};
exports.RoomsController = RoomsController;
__decorate([
    (0, common_1.Get)('/search'),
    __param(0, (0, common_1.Query)('location')),
    __param(1, (0, common_1.Query)('minPrice')),
    __param(2, (0, common_1.Query)('maxPrice')),
    __param(3, (0, common_1.Query)('keyword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "findByFilter", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.HOST),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 5, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/rooms',
            filename: (req, file, cb) => {
                const unique = (0, uuid_1.v4)() + (0, path_1.extname)(file.originalname);
                cb(null, unique);
            },
        }),
    })),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new room (host only)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'Luxury Apartment' },
                location: { type: 'string', example: 'Islamabad' },
                price: { type: 'number', example: 2500 },
                description: { type: 'string', example: 'Spacious and well-lit' },
                images: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' }
                }
            },
            required: ['title', 'location', 'price', 'images']
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Room created successfully' }),
    (0, swagger_2.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_room_dto_1.CreateRoomDto, Array, Object]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "createRoom", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.HOST),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_room_dto_1.UpdateRoomDto]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.HOST),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "findOne", null);
exports.RoomsController = RoomsController = __decorate([
    (0, swagger_2.ApiTags)('Rooms'),
    (0, swagger_2.ApiBearerAuth)(),
    (0, common_1.Controller)('rooms'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService])
], RoomsController);
let AdminRoomsController = class AdminRoomsController {
    roomsService;
    constructor(roomsService) {
        this.roomsService = roomsService;
    }
    getAllRoomsForAdmin() {
        return this.roomsService.getAllRoomsWithHost();
    }
    deleteRoomByAdmin(id) {
        return this.roomsService.delete(id);
    }
};
exports.AdminRoomsController = AdminRoomsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: View all rooms with host details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All room listings with hosts' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminRoomsController.prototype, "getAllRoomsForAdmin", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Admin: Delete a room by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Room deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminRoomsController.prototype, "deleteRoomByAdmin", null);
exports.AdminRoomsController = AdminRoomsController = __decorate([
    (0, swagger_2.ApiTags)('Admin-Rooms'),
    (0, swagger_2.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('admin/rooms'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService])
], AdminRoomsController);
//# sourceMappingURL=rooms.controller.js.map