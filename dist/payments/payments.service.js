"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = require("stripe");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("../bookings/schemas/booking.schema");
const payment_schema_1 = require("./schemas/payment.schema");
let PaymentsService = class PaymentsService {
    configService;
    bookingModel;
    paymentModel;
    stripe;
    constructor(configService, bookingModel, paymentModel) {
        this.configService = configService;
        this.bookingModel = bookingModel;
        this.paymentModel = paymentModel;
        this.stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2025-05-28.basil',
        });
    }
    async createCheckoutSession(dto) {
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
            cancel_url: 'http://localhost:3000/payment/cancel',
            metadata: {
                bookingId,
                userId,
            },
        });
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
    async verifyCheckoutSession(sessionId) {
        const session = await this.stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === 'paid') {
            const { bookingId, userId } = session.metadata;
            await this.bookingModel.findByIdAndUpdate(bookingId, {
                paymentStatus: 'paid',
                status: 'confirmed',
                paymentIntentId: session.payment_intent,
            });
            await this.paymentModel.findOneAndUpdate({ stripeSessionId: sessionId }, {
                status: 'paid',
                paymentIntentId: session.payment_intent,
            });
            return { message: '✅ Payment verified and booking updated.' };
        }
        return { message: '❌ Payment not completed.' };
    }
    async handleStripeEvent(event) {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
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
                await this.paymentModel.findOneAndUpdate({ stripeSessionId: session.id }, {
                    status: 'paid',
                    paymentIntentId: session.payment_intent,
                });
                console.log(`✅ Webhook: Booking ${bookingId} marked as paid for user ${userId}`);
            }
        }
    }
    async retrieveSession(sessionId) {
        try {
            return await this.stripe.checkout.sessions.retrieve(sessionId);
        }
        catch (error) {
            console.error('❌ Failed to retrieve Stripe session:', error.message);
            return null;
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(2, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model,
        mongoose_2.Model])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map