import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments.service';
export declare class StripeWebhookController {
    private readonly configService;
    private readonly paymentsService;
    private stripe;
    constructor(configService: ConfigService, paymentsService: PaymentsService);
    handleStripeWebhook(request: Request, response: Response, signature: string): Promise<Response<any, Record<string, any>> | undefined>;
}
