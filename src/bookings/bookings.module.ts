// File: src/bookings/bookings.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { Room, RoomSchema } from '../rooms/schemas/room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Room.name, schema: RoomSchema },
    ]),
  ],
  exports: [
    MongooseModule, // 👈 Must export it so other modules like StripeModule can use it
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}