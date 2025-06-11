import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { BookingStatus } from '../enums/booking-status.enum';

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true})
  guest: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' , required: true})
  room: mongoose.Types.ObjectId;

  @Prop({ type: Date, required: true })
  checkInDate: Date;

  @Prop({ type: Date, required: true })
  checkOutDate: Date;

  @Prop({ enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
