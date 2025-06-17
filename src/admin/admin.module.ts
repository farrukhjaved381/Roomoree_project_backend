// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { Room, RoomSchema } from '../rooms/schemas/room.schema';
import { Dispute, DisputeSchema } from 'src/disputes/schemas/dispute.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Room.name, schema: RoomSchema },
      { name: Dispute.name, schema: DisputeSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
