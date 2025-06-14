import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schemas/room.schema';
import { ReviewsModule } from '../reviews/reviews.module';
import { AdminRoomsController } from './admin-rooms.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    ReviewsModule],
  controllers: [RoomsController, AdminRoomsController],
  providers: [RoomsService],
 
})
export class RoomsModule {}
