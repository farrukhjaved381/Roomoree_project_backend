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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const create_checkout_session_dto_1 = require("./dto/create-checkout-session.dto");
const swagger_1 = require("@nestjs/swagger");
const stripe_service_1 = require("./stripe.service");
const config_1 = require("@nestjs/config");
const stripe_1 = require("stripe");
let PaymentsController = class PaymentsController {
    paymentsService;
    stripeService;
    configService;
    constructor(paymentsService, stripeService, configService) {
        this.paymentsService = paymentsService;
        this.stripeService = stripeService;
        this.configService = configService;
    }
    async createCheckout(dto) {
        const session = await this.paymentsService.createCheckoutSession(dto);
        if (!session.url) {
            throw new common_1.BadRequestException('Failed to create checkout session');
        }
        return { url: session.url };
    }
    async handleStripeSuccess(sessionId) {
        if (!sessionId) {
            throw new common_1.BadRequestException('Missing session ID');
        }
        const session = await this.stripeService.retrieveSession(sessionId);
        if (!session || session.payment_status !== 'paid') {
            throw new common_1.BadRequestException('Invalid or unpaid session');
        }
        return {
            message: '🎉 Payment Successful! Your booking has been confirmed.',
        };
    }
    async paymentCancel(res) {
        return res.status(200).json({
            message: '❌ Payment was cancelled. You can try again.',
        });
    }
    async verifyPayment(sessionId) {
        return this.paymentsService.verifyCheckoutSession(sessionId);
    }
    async handleWebhook(req, res, signature) {
        const stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2025-05-28.basil',
        });
        try {
            const event = stripe.webhooks.constructEvent(req.body, signature, this.configService.get('STRIPE_WEBHOOK_SECRET'));
            await this.paymentsService.handleStripeEvent(event);
            res.status(common_1.HttpStatus.OK).send('Webhook received');
        }
        catch (err) {
            console.error('❌ Stripe webhook signature failed:', err.message);
            res.status(common_1.HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
        }
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('create-checkout-session'),
    (0, swagger_1.ApiBody)({
        type: create_checkout_session_dto_1.CreateCheckoutSessionDto,
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
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_checkout_session_dto_1.CreateCheckoutSessionDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createCheckout", null);
__decorate([
    (0, common_1.Get)('success'),
    __param(0, (0, common_1.Query)('session_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "handleStripeSuccess", null);
__decorate([
    (0, common_1.Get)('cancel'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "paymentCancel", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('verify'),
    __param(0, (0, common_1.Query)('session_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Object, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "handleWebhook", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        stripe_service_1.StripeService,
        config_1.ConfigService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map