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
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const bookings_service_1 = require("./bookings.service");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_schema_1 = require("../users/schemas/user.schema");
const swagger_1 = require("@nestjs/swagger");
const booking_schema_1 = require("./schemas/booking.schema");
let BookingsController = class BookingsController {
    bookingsService;
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    async createBooking(dto, req) {
        return this.bookingsService.create(dto, req.user._id);
    }
    async findMyBookings(req) {
        return this.bookingsService.findGuestBookings(req.user._id);
    }
    async getUpcomingBookings(req) {
        return this.bookingsService.getUpcomingBookings(req.user._id);
    }
    async getPastBookings(req) {
        return this.bookingsService.getPastBookings(req.user._id);
    }
    async findHostBookings(req) {
        return this.bookingsService.findHostBookings(req.user._id);
    }
    async delete(id, req) {
        return this.bookingsService.deleteBooking(id, req.user._id);
    }
    async acceptBooking(id, req) {
        return this.bookingsService.acceptBooking(id, req.user._id);
    }
    async declineBooking(id, req) {
        return this.bookingsService.declineBooking(id, req.user._id);
    }
    async getGuestCalendar(req) {
        return this.bookingsService.getGuestCalendar(req.user._id);
    }
    async getHostCalendar(req) {
        return this.bookingsService.getHostCalendar(req.user._id);
    }
    async checkAvailability(roomId, from, to) {
        if (!from || !to) {
            throw new common_1.BadRequestException('Both from and to dates are required');
        }
        const fromDate = new Date(from);
        const toDate = new Date(to);
        return this.bookingsService.checkRoomAvailability(roomId, fromDate, toDate);
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.GUEST),
    (0, swagger_1.ApiOperation)({ summary: 'Create a booking (guest only)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Booking created successfully',
        type: booking_schema_1.Booking,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Date conflict or invalid input',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_dto_1.CreateBookingDto, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "createBooking", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.GUEST),
    (0, swagger_1.ApiOperation)({ summary: 'Get all bookings for the current guest' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns all bookings for the guest',
        type: [booking_schema_1.Booking],
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "findMyBookings", null);
__decorate([
    (0, common_1.Get)('/upcoming'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.GUEST),
    (0, swagger_1.ApiOperation)({ summary: 'View upcoming bookings (guest only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Upcoming bookings fetched successfully',
        type: [booking_schema_1.Booking],
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getUpcomingBookings", null);
__decorate([
    (0, common_1.Get)('/past'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.GUEST),
    (0, swagger_1.ApiOperation)({ summary: 'View past bookings (guest only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Past bookings fetched successfully',
        type: [booking_schema_1.Booking],
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getPastBookings", null);
__decorate([
    (0, common_1.Get)('/host'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.HOST),
    (0, swagger_1.ApiOperation)({ summary: 'Get all bookings for the current host' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns all bookings for the host',
        type: [booking_schema_1.Booking],
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "findHostBookings", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.GUEST, user_schema_1.UserRole.HOST),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a booking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking deleted successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Not authorized to delete this booking',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(':id/accept'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.HOST),
    (0, swagger_1.ApiOperation)({ summary: 'Accept a booking (host only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Booking accepted successfully',
        type: booking_schema_1.Booking,
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "acceptBooking", null);
__decorate([
    (0, common_1.Patch)(':id/decline'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.HOST),
    (0, swagger_1.ApiOperation)({ summary: 'Decline a booking (host only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Booking declined successfully',
        type: booking_schema_1.Booking,
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "declineBooking", null);
__decorate([
    (0, common_1.Get)('/calendar/guest'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.GUEST),
    (0, swagger_1.ApiOperation)({ summary: 'View calendar of your confirmed bookings (Guest)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of confirmed bookings' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getGuestCalendar", null);
__decorate([
    (0, common_1.Get)('/calendar/host'),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.HOST),
    (0, swagger_1.ApiOperation)({ summary: 'View all confirmed bookings for your properties (Host)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of bookings for host rooms' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getHostCalendar", null);
__decorate([
    (0, common_1.Get)('/availability/:roomId'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if a room is available for a date range' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Availability and conflicts (if any)',
    }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: true, type: String, example: '2025-06-15' }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: true, type: String, example: '2025-06-20' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "checkAvailability", null);
exports.BookingsController = BookingsController = __decorate([
    (0, swagger_1.ApiTags)('Bookings'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('bookings'),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map