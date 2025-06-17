import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2025-05-28.basil',
    });
  }

  async retrieveSession(sessionId: string) {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }
} 