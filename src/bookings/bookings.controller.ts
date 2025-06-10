// File: src/bookings/bookings.controller.ts

import { Controller, Post, Get, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Roles(UserRole.GUEST)
  @Post()
  create(@Body() dto: CreateBookingDto, @Req() req) {
    return this.bookingsService.create(dto, req.user.userId);
  }

  @Roles(UserRole.GUEST)
  @Get()
  findMyBookings(@Req() req) {
    return this.bookingsService.findGuestBookings(req.user.userId);
  }

  @Roles(UserRole.HOST)
  @Get('/host')
  findHostBookings(@Req() req) {
    return this.bookingsService.findHostBookings(req.user.userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    return this.bookingsService.deleteBooking(id, req.user.userId);
  }
}