import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Socket } from 'socket.io';
  import { Logger } from '@nestjs/common';
  import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service'; // inject this
import mongoose from 'mongoose';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly configService: ConfigService,
        private readonly chatService: ChatService,
      ) {}

    private logger = new Logger('ChatGateway');
    private users = new Map<string, string>(); // socket.id => userId
  
    handleConnection(socket: Socket) {
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;
        const secret = this.configService.get<string>('JWT_SECRET');
      
        if (!secret) {
          this.logger.error('JWT_SECRET is not set');
          socket.disconnect();
          return;
        }
      
        try {
          const decoded = jwt.verify(token, secret) as any;
          const userId = decoded.sub;
      
          this.users.set(socket.id, userId);
          socket.data.userId = userId;
      
          this.logger.log(`User connected: ${userId}`);
        } catch (err) {
          this.logger.warn('Socket auth failed');
          socket.disconnect();
        }
      }
  
    handleDisconnect(socket: Socket) {
      const userId = this.users.get(socket.id);
      this.users.delete(socket.id);
      this.logger.log(`User disconnected: ${userId}`);
    }
  
    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() socket: Socket) {
      socket.join(roomId);
      this.logger.log(`${this.users.get(socket.id)} joined room ${roomId}`);
    }
  
    @SubscribeMessage('message')
    async handleMessage(
      @MessageBody() payload: { room: string; message: string; receiver: string },
      @ConnectedSocket() socket: Socket,
    ) {
      const senderId = socket.data.userId;
      
      if (!mongoose.isValidObjectId(payload.receiver)) {
        this.logger.warn('Invalid receiver ID');
        return;
      }
      
      if (!mongoose.isValidObjectId(payload.room)) {
        this.logger.warn('Invalid room ID');
        return;
      }
     
      console.log('📤 Message received from socket:', {
        senderId,
        ...payload,
      });
    
      const saved = await this.chatService.saveMessage({
        sender: senderId,
        receiver: payload.receiver,
        room: payload.room,
        text: payload.message,
      });
    
      console.log('💾 Message saved in DB:', saved);
    
      const messageToSend = {
        sender: senderId,
        text: payload.message,
        room: payload.room,
        createdAt: new Date(),
      };
    
      socket.to(payload.room).emit('message', messageToSend);
      socket.emit('message', messageToSend);
    }
    
    
  }
  