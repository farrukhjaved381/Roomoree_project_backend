// src/stripe/stripe.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import * as express from 'express';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [BookingsModule],
  controllers: [StripeController],
})
export class StripeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        express.raw({ type: 'application/json' }) // ⬅️ raw body
      )
      .forRoutes('payments/webhook'); // ⬅️ exact route
  }
}
