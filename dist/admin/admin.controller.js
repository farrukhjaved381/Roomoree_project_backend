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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_schema_1 = require("../users/schemas/user.schema");
const jwt_guard_1 = require("../auth/jwt.guard");
const roles_guard_1 = require("../auth/roles.guard");
const swagger_1 = require("@nestjs/swagger");
const update_user_dto_1 = require("../users/dto/update-user.dto");
const update_booking_dto_1 = require("../bookings/dto/update-booking.dto");
const update_room_dto_1 = require("../rooms/dto/update-room.dto");
const room_schema_1 = require("../rooms/schemas/room.schema");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    getAnalytics() {
        return this.adminService.getAnalytics();
    }
    findAllUsers() {
        return this.adminService.findAllUsers();
    }
    deleteUser(id) {
        return this.adminService.deleteUser(id);
    }
    updateUser(id, updateDto) {
        return this.adminService.updateUser(id, updateDto);
    }
    findAllBookings() {
        return this.adminService.findAllBookings();
    }
    deleteBooking(id) {
        return this.adminService.deleteBooking(id);
    }
    updateBooking(id, updateDto) {
        return this.adminService.updateBooking(id, updateDto);
    }
    async getAllRooms() {
        return this.adminService.getAllRooms();
    }
    async deleteRoom(roomId) {
        return this.adminService.deleteRoom(roomId);
    }
    async updateRoom(roomId, updateDto) {
        return this.adminService.updateRoom(roomId, updateDto);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('analytics'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'View all users' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findAllUsers", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a user' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Patch)('users/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a user' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Get)('bookings'),
    (0, swagger_1.ApiOperation)({ summary: 'View all bookings' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findAllBookings", null);
__decorate([
    (0, common_1.Delete)('bookings/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a booking' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteBooking", null);
__decorate([
    (0, common_1.Patch)('bookings/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a booking' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_booking_dto_1.UpdateBookingDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateBooking", null);
__decorate([
    (0, common_1.Get)('rooms'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all rooms (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [room_schema_1.Room] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllRooms", null);
__decorate([
    (0, common_1.Delete)('rooms/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete room by ID (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Room deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteRoom", null);
__decorate([
    (0, common_1.Patch)('rooms/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update room info (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Room updated', type: room_schema_1.Room }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_room_dto_1.UpdateRoomDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateRoom", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map