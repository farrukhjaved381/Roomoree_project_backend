import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  location: string;

  @Prop({ type: [String], default: [] })
  images: string[];
  

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true })
  host: mongoose.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], default: [] })
reviews: mongoose.Types.ObjectId[];

}

export const RoomSchema = SchemaFactory.createForClass(Room);
