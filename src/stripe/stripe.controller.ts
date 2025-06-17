// src/stripe/stripe.controller.ts
import {
    Controller,
    Post,
    Req,
    Res,
    Headers,
    HttpCode,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { ConfigService } from '@nestjs/config';
  import Stripe from 'stripe';
  import { InjectModel } from '@nestjs/mongoose';
  import { Booking } from '../bookings/schemas/booking.schema';
  import { Model } from 'mongoose';
  
  @Controller('payments')
  export class StripeController {
    private stripe: Stripe;
  
    constructor(
      private configService: ConfigService,
      @InjectModel(Booking.name)
      private bookingModel: Model<Booking>,
    ) {
      this.stripe = new Stripe(configService.get<string>('STRIPE_SECRET_KEY')!, {
        apiVersion: '2025-05-28.basil',
      });
    }
  
    @Post('webhook')
    @HttpCode(200)
    async handleWebhook(
      @Req() req: Request,
      @Res() res: Response,
      @Headers('stripe-signature') signature: string,
    ) {
      const endpointSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET')!;
  
      let event: Stripe.Event;
  
      try {
        event = this.stripe.webhooks.constructEvent(
          (req as any).body, // ✅ body is now raw buffer due to express.raw()
          signature,
          endpointSecret,
        );
      } catch (err) {
        console.error('❌ Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
  
      // ✅ Handle session completion
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;
  
        if (bookingId) {
          await this.bookingModel.findByIdAndUpdate(bookingId, {
            status: 'confirmed',
            paymentStatus: 'paid',
            paidAt: new Date(),
            paymentIntentId: session.payment_intent,
            transactionId: session.id,
          });
  
          console.log(`✅ Booking updated to paid: ${bookingId}`);
        }
      }
  
      res.json({ received: true });
    }
  }
  