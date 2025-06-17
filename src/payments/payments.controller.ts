// src/payments/payments.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpCode,
  Query,
  BadRequestException,
  Headers,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { RawBodyRequest } from './types/raw-body-request.interface';
import { StripeService } from './stripe.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
  ) {}

  // POST /payments/create-checkout-session
  @Post('create-checkout-session')
  @ApiBody({
    type: CreateCheckoutSessionDto,
    examples: {
      example1: {
        summary: 'Create Checkout Session Example',
        value: {
          amount: 120,
          currency: 'usd',
          bookingId: '684ff0cd56f8b526e70de671',
          userId: '664a6b4b2f3df4915e6dc9c4',
          successUrl: 'http://localhost:3000/payments/success',
          cancelUrl: 'http://localhost:3000/payments/cancel',
        },
      },
    },
  })
  async createCheckout(
    @Body() dto: CreateCheckoutSessionDto,
  ): Promise<{ url: string }> {
    const session = await this.paymentsService.createCheckoutSession(dto);
    if (!session.url) {
      throw new BadRequestException('Failed to create checkout session');
    }
    return { url: session.url };
  }

  // GET /payments/success
  @Get('success')
  async handleStripeSuccess(@Query('session_id') sessionId: string) {
    if (!sessionId) {
      throw new BadRequestException('Missing session ID');
    }

    const session = await this.stripeService.retrieveSession(sessionId);
    if (!session || session.payment_status !== 'paid') {
      throw new BadRequestException('Invalid or unpaid session');
    }

    return {
      message: '🎉 Payment Successful! Your booking has been confirmed.',
    };
  }

  // GET /payments/cancel
  @Get('cancel')
  async paymentCancel(@Res() res: Response) {
    return res.status(200).json({
      message: '❌ Payment was cancelled. You can try again.',
    });
  }

  // GET /payments/verify?session_id=xyz
  @HttpCode(200)
  @Get('verify')
  async verifyPayment(@Query('session_id') sessionId: string) {
    return this.paymentsService.verifyCheckoutSession(sessionId);
  }

  // POST /payments/webhook
  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2025-05-28.basil',
    });

    try {
      const event = stripe.webhooks.constructEvent(
        (req as any).body,
        signature,
        this.configService.get('STRIPE_WEBHOOK_SECRET')!,
      );

      // ✅ Send to your service
      await this.paymentsService.handleStripeEvent(event);

      res.status(HttpStatus.OK).send('Webhook received');
    } catch (err) {
      console.error('❌ Stripe webhook signature failed:', err.message);
      res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }
  }

}
