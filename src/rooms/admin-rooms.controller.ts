// src/rooms/admin-rooms.controller.ts

import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Admin-Rooms')
@ApiBearerAuth('JWT-auth')
@Controller('admin/rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminRoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Admin: View all rooms with host details' })
  @ApiResponse({ status: 200, description: 'All room listings with hosts' })
  getAllRoomsForAdmin() {
    return this.roomsService.getAllRoomsWithHost();
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Admin: Delete a room by ID' })
  @ApiResponse({ status: 200, description: 'Room deleted successfully' })
  deleteRoomByAdmin(@Param('id') id: string) {
    return this.roomsService.delete(id);
  }
}
