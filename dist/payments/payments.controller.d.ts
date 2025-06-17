import { PaymentsService } from './payments.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { Response } from 'express';
import { StripeService } from './stripe.service';
import { ConfigService } from '@nestjs/config';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly stripeService;
    private readonly configService;
    constructor(paymentsService: PaymentsService, stripeService: StripeService, configService: ConfigService);
    createCheckout(dto: CreateCheckoutSessionDto): Promise<{
        url: string;
    }>;
    handleStripeSuccess(sessionId: string): Promise<{
        message: string;
    }>;
    paymentCancel(res: Response): Promise<Response<any, Record<string, any>>>;
    verifyPayment(sessionId: string): Promise<{
        message: string;
    }>;
    handleWebhook(req: Request, res: Response, signature: string): Promise<void>;
}
