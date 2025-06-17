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
exports.StripeController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = require("stripe");
const mongoose_1 = require("@nestjs/mongoose");
const booking_schema_1 = require("../bookings/schemas/booking.schema");
const mongoose_2 = require("mongoose");
let StripeController = class StripeController {
    configService;
    bookingModel;
    stripe;
    constructor(configService, bookingModel) {
        this.configService = configService;
        this.bookingModel = bookingModel;
        this.stripe = new stripe_1.default(configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2025-05-28.basil',
        });
    }
    async handleWebhook(req, res, signature) {
        const endpointSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
        }
        catch (err) {
            console.error('❌ Webhook signature verification failed:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const bookingId = session.metadata?.bookingId;
            if (bookingId) {
                await this.bookingModel.findByIdAndUpdate(bookingId, {
                    status: 'confirmed',
                    paymentStatus: 'paid',
                    paidAt: new Date(),
                    paymentIntentId: session.payment_intent,
                    transactionId: session.id,
                });
                console.log(`✅ Booking updated to paid: ${bookingId}`);
            }
        }
        res.json({ received: true });
    }
};
exports.StripeController = StripeController;
__decorate([
    (0, common_1.Post)('webhook'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "handleWebhook", null);
exports.StripeController = StripeController = __decorate([
    (0, common_1.Controller)('payments'),
    __param(1, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model])
], StripeController);
//# sourceMappingURL=stripe.controller.js.map