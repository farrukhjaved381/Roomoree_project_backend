"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const mongoose_1 = require("@nestjs/mongoose");
const rooms_module_1 = require("./rooms/rooms.module");
const bookings_module_1 = require("./bookings/bookings.module");
const chat_module_1 = require("./chat/chat.module");
const review_schema_1 = require("./reviews/schemas/review.schema");
const booking_schema_1 = require("./bookings/schemas/booking.schema");
const reviews_module_1 = require("./reviews/reviews.module");
const admin_module_1 = require("./admin/admin.module");
const disputes_module_1 = require("./disputes/disputes.module");
const payments_module_1 = require("./payments/payments.module");
const stripe_module_1 = require("./stripe/stripe.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/roomoree'),
            users_module_1.UsersModule,
            mongoose_1.MongooseModule.forFeature([
                { name: review_schema_1.Review.name, schema: review_schema_1.ReviewSchema },
                { name: booking_schema_1.Booking.name, schema: booking_schema_1.BookingSchema },
            ]),
            auth_module_1.AuthModule,
            rooms_module_1.RoomsModule,
            reviews_module_1.ReviewsModule,
            bookings_module_1.BookingsModule,
            admin_module_1.AdminModule,
            chat_module_1.ChatModule,
            disputes_module_1.DisputesModule,
            payments_module_1.PaymentsModule,
            stripe_module_1.StripeModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map