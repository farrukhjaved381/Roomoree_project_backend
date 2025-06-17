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
exports.StripeWebhookController = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = require("stripe");
const config_1 = require("@nestjs/config");
const payments_service_1 = require("./payments.service");
let StripeWebhookController = class StripeWebhookController {
    configService;
    paymentsService;
    stripe;
    constructor(configService, paymentsService) {
        this.configService = configService;
        this.paymentsService = paymentsService;
        this.stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2025-05-28.basil',
        });
    }
    async handleStripeWebhook(request, response, signature) {
        const endpointSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(request.body, signature, endpointSecret);
        }
        catch (err) {
            console.error('⚠️ Webhook signature verification failed.', err.message);
            return response.status(400).send(`Webhook Error: ${err.message}`);
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const bookingId = session.metadata?.bookingId;
            if (bookingId) {
                await this.paymentsService.confirmBookingPayment(bookingId);
            }
        }
        response.send({ received: true });
    }
};
exports.StripeWebhookController = StripeWebhookController;
__decorate([
    (0, common_1.Post)('stripe'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], StripeWebhookController.prototype, "handleStripeWebhook", null);
exports.StripeWebhookController = StripeWebhookController = __decorate([
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        payments_service_1.PaymentsService])
], StripeWebhookController);
//# sourceMappingURL=stripe.webhook.controller.js.map