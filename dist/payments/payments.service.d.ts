import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Booking } from '../bookings/schemas/booking.schema';
import { Payment } from './schemas/payment.schema';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
export declare class PaymentsService {
    private configService;
    private bookingModel;
    private paymentModel;
    private stripe;
    constructor(configService: ConfigService, bookingModel: Model<Booking>, paymentModel: Model<Payment>);
    createCheckoutSession(dto: CreateCheckoutSessionDto): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    verifyCheckoutSession(sessionId: string): Promise<{
        message: string;
    }>;
    handleStripeEvent(event: Stripe.Event): Promise<void>;
    retrieveSession(sessionId: string): Promise<Stripe.Response<Stripe.Checkout.Session> | null>;
}
