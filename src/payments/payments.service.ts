import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from '../bookings/schemas/booking.schema';
import { Payment } from './schemas/payment.schema';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2025-05-28.basil',
    });
  }

  // ✅ Create Stripe Checkout Session
  async createCheckoutSession(dto: CreateCheckoutSessionDto) {
    const { amount, bookingId, userId, currency, successUrl, cancelUrl } = dto;

    if (!amount || isNaN(amount)) {
      throw new Error('❌ Invalid amount for Stripe Checkout session.');
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: 'Room booking payment',
            },
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/payments/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/payment/cancel',  // ✅ Use dynamic cancel URL
      metadata: {
        bookingId,
        userId,
      },
    });

    // ✅ Save initial payment record
    await this.paymentModel.create({
      bookingId,
      userId,
      amount,
      currency,
      stripeSessionId: session.id,
      status: 'pending',
    });

    return session;
  }

  // ✅ Called by frontend to verify payment manually
  async verifyCheckoutSession(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const { bookingId, userId } = session.metadata as {
        bookingId: string;
        userId: string;
      };

      await this.bookingModel.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid',
        status: 'confirmed',
        paymentIntentId: session.payment_intent,
      });

      await this.paymentModel.findOneAndUpdate(
        { stripeSessionId: sessionId },
        {
          status: 'paid',
          paymentIntentId: session.payment_intent as string,
        },
      );

      return { message: '✅ Payment verified and booking updated.' };
    }

    return { message: '❌ Payment not completed.' };
  }

  // ❌ REMOVE: old handleStripeWebhook(request, signature) version — replaced by controller
  // ✅ KEEP: Called by webhook controller after signature verification
  async handleStripeEvent(event: Stripe.Event) {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;
      const userId = session.metadata?.userId;

      if (bookingId && userId) {
        await this.bookingModel.findByIdAndUpdate(bookingId, {
          paymentStatus: 'paid',
          status: 'confirmed',
          paidAt: new Date(),
          paymentIntentId: session.payment_intent,
          transactionId: session.id,
        });

        await this.paymentModel.findOneAndUpdate(
          { stripeSessionId: session.id },
          {
            status: 'paid',
            paymentIntentId: session.payment_intent as string,
          },
        );

        console.log(`✅ Webhook: Booking ${bookingId} marked as paid for user ${userId}`);
      }
    }
  }

  // ✅ Utility to fetch session details
  async retrieveSession(sessionId: string) {
    try {
      return await this.stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      console.error('❌ Failed to retrieve Stripe session:', error.message);
      return null;
    }
  }
}
