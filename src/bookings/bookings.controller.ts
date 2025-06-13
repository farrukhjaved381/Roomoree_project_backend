// File: src/bookings/bookings.controller.ts

import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Patch,
  Req,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Booking } from './schemas/booking.schema';
import { PopulatedBooking } from './interfaces/populated-booking.interface';

@ApiTags('Bookings')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  @Roles(UserRole.GUEST)
  @ApiOperation({ summary: 'Create a booking (guest only)' })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    type: Booking,
  })
  @ApiResponse({
    status: 400,
    description: 'Date conflict or invalid input',
  })
  async createBooking(
    @Body() dto: CreateBookingDto,
    @Req() req,
  ): Promise<PopulatedBooking> {
    return this.bookingsService.create(dto, req.user._id);
  }

  @Get()
  @Roles(UserRole.GUEST)
  @ApiOperation({ summary: 'Get all bookings for the current guest' })
  @ApiResponse({
    status: 200,
    description: 'Returns all bookings for the guest',
    type: [Booking],
  })
  async findMyBookings(@Req() req): Promise<PopulatedBooking[]> {
    return this.bookingsService.findGuestBookings(req.user._id);
  }

  @Get('/upcoming')
  @Roles(UserRole.GUEST)
  @ApiOperation({ summary: 'View upcoming bookings (guest only)' })
  @ApiResponse({
    status: 200,
    description: 'Upcoming bookings fetched successfully',
    type: [Booking],
  })
  async getUpcomingBookings(@Req() req): Promise<PopulatedBooking[]> {
    return this.bookingsService.getUpcomingBookings(req.user._id);
  }

  @Get('/past')
  @Roles(UserRole.GUEST)
  @ApiOperation({ summary: 'View past bookings (guest only)' })
  @ApiResponse({
    status: 200,
    description: 'Past bookings fetched successfully',
    type: [Booking],
  })
  async getPastBookings(@Req() req): Promise<PopulatedBooking[]> {
    return this.bookingsService.getPastBookings(req.user._id);
  }

  @Get('/host')
  @Roles(UserRole.HOST)
  @ApiOperation({ summary: 'Get all bookings for the current host' })
  @ApiResponse({
    status: 200,
    description: 'Returns all bookings for the host',
    type: [Booking],
  })
  async findHostBookings(@Req() req): Promise<PopulatedBooking[]> {
    return this.bookingsService.findHostBookings(req.user._id);
  }

  @Delete(':id')
  @Roles(UserRole.GUEST, UserRole.HOST)
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not authorized to delete this booking',
  })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async delete(@Param('id') id: string, @Req() req): Promise<void> {
    return this.bookingsService.deleteBooking(id, req.user._id);
  }

  @Patch(':id/accept')
  @Roles(UserRole.HOST)
  @ApiOperation({ summary: 'Accept a booking (host only)' })
  @ApiResponse({
    status: 200,
    description: 'Booking accepted successfully',
    type: Booking,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async acceptBooking(
    @Param('id') id: string,
    @Req() req,
  ): Promise<PopulatedBooking> {
    return this.bookingsService.acceptBooking(id, req.user._id);
  }

  @Patch(':id/decline')
  @Roles(UserRole.HOST)
  @ApiOperation({ summary: 'Decline a booking (host only)' })
  @ApiResponse({
    status: 200,
    description: 'Booking declined successfully',
    type: Booking,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async declineBooking(
    @Param('id') id: string,
    @Req() req,
  ): Promise<PopulatedBooking> {
    return this.bookingsService.declineBooking(id, req.user._id);
  }

  @Get('/calendar/guest')
  @Roles(UserRole.GUEST)
  @ApiOperation({ summary: 'View calendar of your confirmed bookings (Guest)' })
  @ApiResponse({ status: 200, description: 'List of confirmed bookings' })
  async getGuestCalendar(@Req() req) {
    return this.bookingsService.getGuestCalendar(req.user._id);
  }

  @Get('/calendar/host')
  @Roles(UserRole.HOST)
  @ApiOperation({ summary: 'View all confirmed bookings for your properties (Host)' })
  @ApiResponse({ status: 200, description: 'List of bookings for host rooms' })
  async getHostCalendar(@Req() req) {
    return this.bookingsService.getHostCalendar(req.user._id);
  }

@Get('/availability/:roomId')
@ApiOperation({ summary: 'Check if a room is available for a date range' })
@ApiResponse({
  status: 200,
  description: 'Availability and conflicts (if any)',
})
@ApiQuery({ name: 'from', required: true, type: String, example: '2025-06-15' })
@ApiQuery({ name: 'to', required: true, type: String, example: '2025-06-20' })
async checkAvailability(
  @Param('roomId') roomId: string,
  @Query('from') from: string,
  @Query('to') to: string,
) {
  if (!from || !to) {
    throw new BadRequestException('Both from and to dates are required');
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);

  return this.bookingsService.checkRoomAvailability(roomId, fromDate, toDate);
}

}
