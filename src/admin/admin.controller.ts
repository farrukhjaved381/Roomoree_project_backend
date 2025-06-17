// src/admin/admin.controller.ts
import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Patch,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UpdateBookingDto } from '../bookings/dto/update-booking.dto';
import { UpdateRoomDto } from '../rooms/dto/update-room.dto';
import { Room } from '../rooms/schemas/room.schema';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }
  // Get analytics
  @Get('analytics')
  @Roles(UserRole.ADMIN)
  getAnalytics() {
    return this.adminService.getAnalytics();
  }

  // USERS
  @Get('users')
  @ApiOperation({ summary: 'View all users' })
  findAllUsers() {
    return this.adminService.findAllUsers();
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete a user' })
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Update a user' })
  updateUser(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    return this.adminService.updateUser(id, updateDto);
  }

  // BOOKINGS
  @Get('bookings')
  @ApiOperation({ summary: 'View all bookings' })
  findAllBookings() {
    return this.adminService.findAllBookings();
  }

  @Delete('bookings/:id')
  @ApiOperation({ summary: 'Delete a booking' })
  deleteBooking(@Param('id') id: string) {
    return this.adminService.deleteBooking(id);
  }

  @Patch('bookings/:id')
  @ApiOperation({ summary: 'Update a booking' })
  updateBooking(@Param('id') id: string, @Body() updateDto: UpdateBookingDto) {
    return this.adminService.updateBooking(id, updateDto);
  }
  // 🏘 Get all room listings
  @Get('rooms')
  @ApiOperation({ summary: 'Get all rooms (Admin)' })
  @ApiResponse({ status: 200, type: [Room] })
  async getAllRooms() {
    return this.adminService.getAllRooms();
  }

  // ❌ Delete a room
  @Delete('rooms/:id')
  @ApiOperation({ summary: 'Delete room by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Room deleted' })
  async deleteRoom(@Param('id') roomId: string) {
    return this.adminService.deleteRoom(roomId);
  }

  // ✏️ Optional: Update room details
  @Patch('rooms/:id')
  @ApiOperation({ summary: 'Update room info (Admin)' })
  @ApiResponse({ status: 200, description: 'Room updated', type: Room })
  async updateRoom(
    @Param('id') roomId: string,
    @Body() updateDto: UpdateRoomDto,
  ) {
    return this.adminService.updateRoom(roomId, updateDto);
  }
}
