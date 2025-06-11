import { Message } from './schemas/message.schema';
import { Model } from 'mongoose';
export declare class ChatService {
    private msgModel;
    constructor(msgModel: Model<Message>);
    saveMessage(data: {
        sender: string;
        receiver: string;
        room?: string;
        text: string;
    }): Promise<import("mongoose").Document<unknown, {}, Message, {}> & Message & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getMessagesBetween(user1: string, user2: string): Promise<(import("mongoose").Document<unknown, {}, Message, {}> & Message & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
}
