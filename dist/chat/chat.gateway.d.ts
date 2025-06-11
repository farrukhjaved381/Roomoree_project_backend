import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly configService;
    private readonly chatService;
    constructor(configService: ConfigService, chatService: ChatService);
    private logger;
    private users;
    handleConnection(socket: Socket): void;
    handleDisconnect(socket: Socket): void;
    handleJoinRoom(roomId: string, socket: Socket): void;
    handleMessage(payload: {
        room: string;
        message: string;
        receiver: string;
    }, socket: Socket): Promise<void>;
}
