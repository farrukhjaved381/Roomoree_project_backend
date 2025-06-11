import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Message.name) private msgModel: Model<Message>) {}

  async saveMessage(data: {
    sender: string;
    receiver: string;
    room?: string;
    text: string;
  }) {
    console.log('⏳ Saving message in chat.service:', data); // ✅ Add this
  
    return this.msgModel.create(data); // ✅ returns a Promise
  }
  

  async getMessagesBetween(user1: string, user2: string) {
    return this.msgModel.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ createdAt: 1 });
  }
}
