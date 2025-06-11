import mongoose, { Document } from 'mongoose';
export type MessageDocument = Message & Document;
export declare class Message {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    room?: mongoose.Types.ObjectId;
    text: string;
}
export declare const MessageSchema: mongoose.Schema<Message, mongoose.Model<Message, any, any, any, mongoose.Document<unknown, any, Message, any> & Message & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Message, mongoose.Document<unknown, {}, mongoose.FlatRecord<Message>, {}> & mongoose.FlatRecord<Message> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
