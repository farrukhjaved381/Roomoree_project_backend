// src/disputes/schemas/dispute.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Booking } from 'src/bookings/schemas/booking.schema';

@Schema({ timestamps: true })
export class Dispute extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  booking: Types.ObjectId;

  @Prop({ required: true })
  reason: string;

  @Prop({ default: 'open', enum: ['open', 'resolved', 'rejected'] })
  status: string;

  @Prop()
  resolutionNote?: string;
}

export const DisputeSchema = SchemaFactory.createForClass(Dispute);
