import mongoose, { Document, Types } from 'mongoose';
export type RoomDocument = Room & Document;
export declare class Room {
    title: string;
    description: string;
    price: number;
    location: string;
    images: string[];
    host: mongoose.Types.ObjectId;
    reviews: mongoose.Types.ObjectId[];
}
export declare const RoomSchema: mongoose.Schema<Room, mongoose.Model<Room, any, any, any, mongoose.Document<unknown, any, Room, any> & Room & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Room, mongoose.Document<unknown, {}, mongoose.FlatRecord<Room>, {}> & mongoose.FlatRecord<Room> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
