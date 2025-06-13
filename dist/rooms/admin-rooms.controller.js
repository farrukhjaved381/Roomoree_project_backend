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
exports.AdminRoomsController = void 0;
const common_1 = require("@nestjs/common");
const rooms_service_1 = require("./rooms.service");
const jwt_guard_1 = require("../auth/jwt.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_schema_1 = require("../users/schemas/user.schema");
const swagger_1 = require("@nestjs/swagger");
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
    (0, swagger_1.ApiTags)('Admin-Rooms'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('admin/rooms'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService])
], AdminRoomsController);
//# sourceMappingURL=admin-rooms.controller.js.map