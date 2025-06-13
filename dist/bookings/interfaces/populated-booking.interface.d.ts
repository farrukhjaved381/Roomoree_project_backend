import { Booking } from '../schemas/booking.schema';
import { Room } from '../../rooms/schemas/room.schema';
import { User } from '../../users/schemas/user.schema';
import { Types } from 'mongoose';
export interface PopulatedRoom extends Omit<Room, 'host'> {
    host: User;
}
export interface PopulatedBooking extends Omit<Booking, 'room' | 'guest'> {
    room: PopulatedRoom;
    guest: User;
    _id: Types.ObjectId;
}
