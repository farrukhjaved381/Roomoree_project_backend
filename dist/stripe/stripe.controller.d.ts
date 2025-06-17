import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Booking } from '../bookings/schemas/booking.schema';
import { Model } from 'mongoose';
export declare class StripeController {
    private configService;
    private bookingModel;
    private stripe;
    constructor(configService: ConfigService, bookingModel: Model<Booking>);
    handleWebhook(req: Request, res: Response, signature: string): Promise<Response<any, Record<string, any>> | undefined>;
}
