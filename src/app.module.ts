// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';
import { ChatModule } from './chat/chat.module';
import { Review, ReviewSchema } from './reviews/schemas/review.schema';
import { Booking, BookingSchema } from './bookings/schemas/booking.schema';
import { ReviewsModule } from './reviews/reviews.module';
import { AdminModule } from './admin/admin.module';
import { DisputesModule } from './disputes/disputes.module';
import { PaymentsModule } from './payments/payments.module';
import { StripeModule } from './stripe/stripe.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/roomoree'),
    UsersModule,
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
    AuthModule,
    RoomsModule,
    ReviewsModule,
    BookingsModule,
    AdminModule,
    ChatModule,
    DisputesModule,
    PaymentsModule,
    StripeModule,
  ],
})
export class AppModule {}
