import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BookingStatus } from '../enums/booking-status.enum';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  guest: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  room: Types.ObjectId;

  @Prop({ required: true })
  checkInDate: Date;

  @Prop({ required: true })
  checkOutDate: Date;

  @Prop({ enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Prop({ default: 'pending' }) // 'pending' | 'paid'
  paymentStatus: string;

  @Prop()
  paymentIntentId?: string;

  @Prop()
  paidAt?: Date;

  @Prop()
  transactionId?: string; // optional for Stripe txn ID
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
