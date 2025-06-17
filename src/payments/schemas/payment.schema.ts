// src/payments/schemas/payment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true })
  bookingId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop()
  paymentIntentId: string;

  @Prop()
  status: string;

  @Prop()
  stripeSessionId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
