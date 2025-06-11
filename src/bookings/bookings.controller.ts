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
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Bookings')
@ApiBearerAuth('JWT-auth')
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Roles(UserRole.GUEST)
  @Post()
  create(@Body() dto: CreateBookingDto, @Req() req) {
    console.log('Creating booking for guest:', req.user);
    return this.bookingsService.create(dto, req.user._id);
  }

  @Roles(UserRole.GUEST)
  @Get()
  findMyBookings(@Req() req) {
    return this.bookingsService.findGuestBookings(req.user._id);
  }

  @Roles(UserRole.HOST)
  @Get('/host')
  findHostBookings(@Req() req) {
    return this.bookingsService.findHostBookings(req.user._id);
  }

  @Roles(UserRole.GUEST, UserRole.HOST)
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    return this.bookingsService.deleteBooking(id, req.user._id);
  }

  @Roles(UserRole.HOST)
  @Patch(':id/accept')
  acceptBooking(@Param('id') id: string, @Req() req) {
    console.log('Host attempting accept:', req.user);
    return this.bookingsService.acceptBooking(id, req.user._id);
  }

  @Roles(UserRole.HOST)
  @Patch(':id/decline')
  declineBooking(@Param('id') id: string, @Req() req) {
    return this.bookingsService.declineBooking(id, req.user._id);
  }
}
