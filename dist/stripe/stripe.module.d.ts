import { NestModule, MiddlewareConsumer } from '@nestjs/common';
export declare class StripeModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void;
}
