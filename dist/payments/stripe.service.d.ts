import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
export declare class StripeService {
    private configService;
    private stripe;
    constructor(configService: ConfigService);
    retrieveSession(sessionId: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
}
