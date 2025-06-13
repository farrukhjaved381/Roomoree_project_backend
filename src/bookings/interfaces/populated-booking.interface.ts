// File: src/bookings/interfaces/populated-booking.interface.ts

import { Booking } from '../schemas/booking.schema';
import { Room } from '../../rooms/schemas/room.schema';
import { User } from '../../users/schemas/user.schema';
import { Document, Types } from 'mongoose';

// Populated room that includes host as a full User object
export interface PopulatedRoom extends Omit<Room, 'host'> {
  host: User;
}

// Booking document where room and guest are fully populated
export interface PopulatedBooking extends Omit<Booking, 'room' | 'guest'> {
  room: PopulatedRoom;
  guest: User;
  _id: Types.ObjectId;
}
 