// src/payments/payments.module.ts
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ConfigModule } from '@nestjs/config';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { StripeService } from './stripe.service';

@Module({
  imports: [ MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
  MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ConfigModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, StripeService],
})
export class PaymentsModule {}
